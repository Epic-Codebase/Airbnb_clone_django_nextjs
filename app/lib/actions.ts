'use server';

import { cookies } from "next/headers";

export async function handleRefrehs() {
    console.log("handling refresh")

    const refreshToken = await getRefreshToken();
    const token = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({
           refresh: refreshToken 
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(async (json) => {
        console.log("Response - Refresh:", json)

        if (json.access) {
            (await cookies()).set('session_access_token', json.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/'
            });

            return json.access;
        } else {
            resetAuthCookies();
        }
    })
    .catch((error) => {
        console.log("error", error);

        resetAuthCookies();
    });

    return token;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    (await cookies()).set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/'
    });

    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    (await cookies()).set('session_userid', '');
    (await cookies()).set('session_access_token', '');
    (await cookies()).set('session_refresh_token', '');
}

export async function getUserId() {
    const userId = (await cookies()).get('session_userid')?.value;
    
    return userId ? userId : null;
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefrehs();
    }

    return accessToken ? accessToken : null;
}

export async function getRefreshToken() {
    const refreshToken = (await cookies()).get('session_refresh_token')?.value;

    return refreshToken ? refreshToken : null;
}