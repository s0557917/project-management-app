import Link from 'next/link'
import { Button } from '@mantine/core'

export default function ViewsTabs(){
    return (
        <ul class="flex inline mb-3">
            <li key={'task-list-tab'} class="bg-cyan-500">
                <Link href={'/task-list'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a'>Task List</Button>
                </Link>
            </li>
            <li key={'calendar-view-tab'} class="bg-cyan-500">
                <Link href={'/calendar'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a'>Calendar</Button>
                </Link>
            </li>
            <li key={'text-editor-tab'} class="bg-cyan-500">
                <Link href={'text-editor'}>
                    <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a'>Text Editor</Button>
                </Link>
            </li>
        </ul>
    )
}