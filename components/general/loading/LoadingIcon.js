import { useState, useEffect } from "react";
import { Loader } from "@mantine/core";
import { useRouter } from "next/router";

export default function LoadingIcon() {
    
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    return loading 
        && <div className="relative z-10 w-screen h-screen">
            <div className="absolute top-0 bottom-0 left-0 right-0  blur-sm w-screen h-screen">
                <Loader className="m-auto z-20" size="xl" />
            </div>
        </div>
}