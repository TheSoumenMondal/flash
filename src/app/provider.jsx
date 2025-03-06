'use client'
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import MessagesContext from '@/context/MessagesContext';
import UserDetailsContext from '@/context/UserDetailsContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { api } from '../../convex/_generated/api';
import { useConvex } from 'convex/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/custom/AppSideBar';
import { Loader2Icon } from 'lucide-react';
import { ActionContext } from '@/context/ActionConext';
import { useRouter } from 'next/navigation';

const Provider = ({ children }) => {
    const [messages, setMessages] = useState();
    const [userDetails, setUserDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [action, setAction] = useState()
    const convex = useConvex();
    const router = useRouter()
    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async () => {
        if (typeof window !== 'undefined') {
            try {
                setIsLoading(true);
                const user = localStorage.getItem("user");
                if (!user) {
                    setIsLoading(false);
                    router.push('/')
                    return;
                }
                const userData = JSON.parse(user);
                const result = await convex.query(api.users.getUser, {
                    email: userData.email
                });
                setUserDetails(result);
            } catch (error) {
                console.error("Authentication error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return <div className='w-full h-screen bg-stone-950 text-white flex justify-center items-center'> <Loader2Icon className='text-white animate-spin mr-3' /> Generation Almost Complete Please Wait a while...</div>;
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}>
            <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
                <MessagesContext.Provider value={{ messages, setMessages }}>
                    <ActionContext.Provider value={{ action, setAction }}>

                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <SidebarProvider onOpenChange={false} defaultOpen={false}>
                                <AppSideBar />
                                {children}
                            </SidebarProvider>
                        </NextThemesProvider>
                    </ActionContext.Provider>
                </MessagesContext.Provider>
            </UserDetailsContext.Provider>
        </GoogleOAuthProvider>
    );
};

export default Provider;