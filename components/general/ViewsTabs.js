import Link from 'next/link'
import { Button } from '@mantine/core'
import { useState } from 'react';
import { useRouter } from "next/router";

export default function ViewsTabs(){
    const [activeTab, setActiveTab] = useState(undefined);

    return (
        <ul className="flex inline mb-3">
            <li key={'task-list-tab'} className={"bg-cyan-500 hover:bg-cyan-700 active:bg-cyan-900 active"}>
                <Link href={'/task-list'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a' onClick={() => setActiveTab(1)}>Task List</Button>
                </Link>
            </li>
            <li key={'calendar-view-tab'} className="bg-cyan-500 hover:bg-cyan-700 active:bg-cyan-900">
                <Link href={'/calendar'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a' onClick={() => setActiveTab(2)}>Calendar</Button>
                </Link>
            </li>
            <li key={'text-editor-tab'} className="bg-cyan-500 hover:bg-cyan-700 active:bg-cyan-900">
                <Link href={'text-editor'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a' onClick={() => setActiveTab(3)}>Text Editor</Button>
                </Link>
            </li>
        </ul>
    )
}