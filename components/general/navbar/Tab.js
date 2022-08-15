import { useRouter } from "next/router";
import { Button } from '@mantine/core'
import Link from 'next/link'

export default function Tab({link, route, text}){
    const isActive = () => {
        switch(route){
            case '/task-list':
                return text === 'Task List';
            case '/calendar':
                return text === 'Calendar';
            case '/text-editor':
                return text === 'Text Editor';
            default:
                return false;
        }
    }
    
    return(
        <li key={'task-list-tab'} className={`${isActive() ? "bg-cyan-500 border-white" : "bg-cyan-900"}  hover:bg-cyan-700 rounded-t-xl`}>
            <Link href={link}>
                <Button my={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 60 }} component='a'>{text}</Button>
            </Link>
        </li>
    )
}