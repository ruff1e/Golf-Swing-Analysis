"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { auth, prisma } from "../auth";
import { headers } from "next/headers";
import { enqueueVideoJob } from "../queue";


export async function uploadVideoAction(formData: FormData) {

    // first verify the user seesion 
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) throw new Error("Unauthorized action");

    // extract the file from the FormData package
    const file = formData.get("video") as File;
    if(!file) throw new Error("No file found");

    const videoId = crypto.randomUUID();
    const userDir = join(process.cwd(), "uploads", session.user.id);
    const filePath = join(userDir, `${videoId}_raw.mp4`);

    //setup the folder to store if it doesn't exist
    if (!existsSync(userDir)) {
        await mkdir(userDir, { recursive: true});
    }
    

    //convert the file data to a buffer and save to disk // next.js cant handle file objects so we have to convert
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);


    // record the metadata in neon for database
    await prisma.video.create({
        data: {
            id: videoId,
            userId: session.user.id,
            status: "pending_skeleton",
            rawVideoPath: filePath,
        },
    });

    await enqueueVideoJob({
        videoId,
        userId: session.user.id,
        filePath,
    });


    return { success: true};

}