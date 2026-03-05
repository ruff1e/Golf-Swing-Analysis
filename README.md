SwingVision: AI-Powered Golf Swing Analysis

SwingVision is a full-stack "Human-in-the-Loop" AI SaaS designed to provide golfers with professional-grade swing analysis.   
The platform combines automated pose estimation with professional coaching feedback through a decoupled, asynchronous processing pipeline.   






Key Features

- Asynchronous AI Processing: Large video files are processed in the background using a decoupled Python worker to ensure the web server remains responsive.   
- AI Skeleton Overlay: Utilizing Google's MediaPipe Tasks API to detect 33 body landmarks and render a biomechanical skeleton overlay.   
- Coach Dashboard: A dedicated Role-Based Access Control (RBAC) interface for coaches to review swings side-by-side (Original vs. AI).   
- Secure Video Streaming: Custom API Route Handlers implementing HTTP Range Requests for efficient, secure, and seekable video playback.   
- Professional Feedback Loop: Secure interface for coaches to provide technical advice, which is then delivered to the athlete's personal dashboard.



Technical Architecture

- Frontend: Next.js 15 App Router with Tailwind CSS for a responsive, dark-mode UI.   
- Backend: Next.js Server Actions for type-safe client-server communication.   
- Database: PostgreSQL (Neon) with Prisma ORM for schema management and type-safety.   
- Job Queue: Redis & BullMQ manage the handoff between the web application and the AI compute layer.   
- AI Layer: A dedicated Python worker using OpenCV and MediaPipe.   
- Media Engineering: Integrated FFmpeg pipeline to ensure cross-browser compatibility (H.264 encoding) for AI-generated media.


