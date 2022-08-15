import Tab from './Tab';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ViewsTabs(){
    const router = useRouter();
   
    return (
        <ul className="flex">
            <Tab
                link={'/task-list'}
                route={router.pathname}
                text={'Task List'}
            />
            <Tab
                link={'/calendar'}
                route={router.pathname}
                text={'Calendar'}
            />
            <Tab
                link={'/text-editor'}
                route={router.pathname}
                text={'Text Editor'}
            />
        </ul>
    )
}