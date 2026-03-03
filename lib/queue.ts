import { Queue } from "bullmq";


const connection = { 
    host: "127.0.0.1",
    port: 6379,     //default redis port
};

// create a bullmq queue, "video-processing" is the name of the queue
export const videoQueue = new Queue("video-processing", {connection});



export async function enqueueVideoJob(payload: {videoId: string, userId: string, filePath: string, }) {

    await videoQueue.add("process-video", payload, {
        attempts: 3,    //if the worker fails, try 3 times
        backoff: {
            type: "exponential",    //wait longer between each try
            delay: 5000,            // start with 5s, then 10s then 20s
        },
    });
}
