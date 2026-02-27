"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const signUp = async (email: string, password: string, name: string) => {
    const result = await auth.api.signUpEmail({
        body: {
            email, password, name, callbackURL: "/"
        },
        headers: await headers(),
    });
    return result;
};


export const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
        body: {
            email, password, callbackURL: "/"
        },
        headers: await headers(),
    });
    return result;
};

export const signOut = async () => {
    const result = await auth.api.signOut({headers: await headers() });
    return result;
};