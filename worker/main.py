import redis 
import json
import cv2
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from mediapipe.tasks.python.components import containers
import mediapipe as mp
import psycopg2
import os
import time
import numpy as np



# Configs
REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6379
DATABASE_URL = os.environ.get("DATABASE_URL")  # get the database url from an environment variable



# Path to the downloaded MediaPipe pose landmarker model file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pose_landmarker.task")

# Connections between landmarks to draw the skeleton lines
# Each tuple is (start_landmark_index, end_landmark_index)
POSE_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 7),    # Left eye/ear
    (0, 4), (4, 5), (5, 6), (6, 8),    # Right eye/ear
    (9, 10),                             # Mouth
    (11, 12),                            # Shoulders
    (11, 13), (13, 15),                  # Left arm
    (12, 14), (14, 16),                  # Right arm
    (11, 23), (12, 24),                  # Torso top
    (23, 24),                            # Hips
    (23, 25), (25, 27), (27, 29), (27, 31),  # Left leg
    (24, 26), (26, 28), (28, 30), (28, 32),  # Right leg
]


def draw_landmarks_on_frame(frame, landmarks):
    # landmarks is a list of 33 NormalizedLandmark objects
    # Each has .x, .y as values between 0.0 and 1.0 (relative to frame size)
    # multiply by frame dimensions to get pixel coordinates

    h, w = frame.shape[:2]

    # Convert all landmarks to pixel coordinates first
    points = []
    for lm in landmarks:
        x = int(lm.x * w)
        y = int(lm.y * h)
        points.append((x, y))

    # Draw connection lines (the skeleton)
    for start_idx, end_idx in POSE_CONNECTIONS:
        cv2.line(frame, points[start_idx], points[end_idx], (0, 255, 0), 2)

    # Draw a circle at each joint
    for x, y in points:
        cv2.circle(frame, (x, y), 4, (0, 0, 255), -1)

    return frame


def process_video(file_path: str) -> str:
    # Take the raw video path, process it frame by frame
    # Then draws the pose skeleton on each frame and save a new video
    # Then return the path to the video

    # example = /uploads/abc/123_raw.mp4 => /uploads/abc/123_skeleton.mp4
    output_path = file_path.replace("_raw.mp4", "_skeleton.mp4")

    # Open the input video file
    cap = cv2.VideoCapture(file_path)

    # Read the video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Create a VideoWriter to write frames to output file
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Configure the pose landmarker using the new Tasks API
    # VIDEO mode means it tracks landmarks across frames
    base_options = mp_python.BaseOptions(model_asset_path=MODEL_PATH)
    options = mp_vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=mp_vision.RunningMode.VIDEO,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    frame_index = 0

    with mp_vision.PoseLandmarker.create_from_options(options) as landmarker:
        while cap.isOpened():
            ret, frame = cap.read()
            # ret is False when there are no more frames to read
            if not ret:
                break

            # MediaPipe Tasks API expects an mp.Image object in RGB format
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

            # Calculate timestamp in milliseconds for VIDEO mode
            # VIDEO mode requires monotonically increasing timestamps
            timestamp_ms = int((frame_index / fps) * 1000)

            # Run pose detection on this frame
            result = landmarker.detect_for_video(mp_image, timestamp_ms)

            # If landmarks were detected, draw the skeleton
            if result.pose_landmarks:
                # result.pose_landmarks is a list of people detected
                # We take index [0] since we expect one golfer in frame
                draw_landmarks_on_frame(frame, result.pose_landmarks[0])

            # Write this frame with or without the skeleton to output video
            out.write(frame)
            frame_index += 1

    # Release resources when done
    cap.release()
    out.release()
    return output_path


def update_db(video_id: str, proc_path: str):
    # Update the video record in Neon to mark the video as ready for coach
    # review then store the processed video path

    # Connect directly to PostgreSQL using psycopg2
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Parameterized query — never use f-strings with SQL, prevents SQL injection
    cur.execute(
        """
        UPDATE "video"
        SET status = 'awaiting_review', "procVideoPath" = %s
        WHERE id = %s
        """,
        (proc_path, video_id),
    )

    conn.commit()
    cur.close()
    conn.close()


def get_next_job(r: redis.Redis):
    

    result = r.blpop("bull:video-processing:wait", timeout=5)

    
    if result is None:
        return None

    # result is a tuple: (list_name, value)
    _, job_id = result

    # BullMQ stores each job's data in a Redis Hash at this key
    job_key = f"bull:video-processing:{job_id}"
    job_data = r.hgetall(job_key)

    if not job_data:
        return None

    # The "data" field is a JSON string of our payload
    return job_id, json.loads(job_data.get("data", "{}"))


def main():
    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=True,  # Return strings instead of bytes
    )
    print("Worker started. Waiting for jobs...")


    while True:
        try:
            job = get_next_job(r)

            # No job available (timeout), loop again
            if job is None:
                continue

            job_id, data = job
            video_id = data["videoId"]
            file_path = data["filePath"]

            print(f"Processing video: {video_id}")
            output_path = process_video(file_path)
            update_db(video_id, output_path)
            print(f"Completed: {output_path}")

        except Exception as e:
            # Log the error but don't crash the worker
            # In production you'd send this to a logging service
            print(f"Error processing job: {e}")
            time.sleep(2)  # Brief pause before retrying


if __name__ == "__main__":
    main()