import React, { useContext, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import UserDetailsContext from '@/context/UserDetailsContext';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';


const SignInDialog = ({ openDialog, closedialog }) => {
    const { userDetails, setUserDetails } = useContext(UserDetailsContext)

    useEffect(() => {
        if (userDetails) {
            closedialog(false)
        }
    }, [userDetails])

    const createUser = useMutation(api.users.createUser)

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } }, // Fixed Bearer token format
                );

                try {
                    await createUser({
                        name: user?.name,
                        email: user?.email,
                        picture: user?.picture,
                        uid: uuidv4()
                    });
                } catch (error) {
                    console.error("Failed to create user in database:", error);
                    return;
                }

                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setUserDetails(user);
                closedialog(false);
            } catch (error) {
                console.error("Google login failed:", error);
            }
        },
        onError: errorResponse => {
            console.error("Google OAuth error:", errorResponse);
        },
    });

    if (userDetails) {
        return null;
    }


    return (
        <div>
            <Dialog open={openDialog} onOpenChange={closedialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex flex-col justify-center items-center">
                                <div className='font-bold text-2xl'>Continue to your code helper :)</div>
                                <p className='text-center mt-2'>
                                    To use this application you must sign in first
                                </p>
                                <Button onClick={googleLogin} className="bg-sky-500 cursor-pointer hover:bg-sky-600 mt-3 text-white">Sign In with Google</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SignInDialog
