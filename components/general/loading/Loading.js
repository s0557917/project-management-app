import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Loader } from "@mantine/core";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function Loading() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const backgroundColor = getThemeColor('bg-gray-200', 'bg-zinc-800');
    const borderColor = getThemeColor('border-gray-300', 'border-zinc-700');

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
    
    return loading && 
    (
        <div className="relative">
            <div className={`${backgroundColor} ${borderColor} fixed bottom-5 left-10 border-[1px] p-2 rounded-md`}>
                <Loader color="green" size="xl" />
            </div>
        </div>
    );
}