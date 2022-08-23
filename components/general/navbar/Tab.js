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
        <li key={'task-list-tab'} className={`${isActive() ? "bg-neutral-900 border-white" : "bg-neutral-700"} hover:bg-neutral-600  ${text !== 'Calendar' ? 'border-x border-x-neutral-900' : ''} text-white flex items-center cursor-pointer`}>
            <Link href={link}>
                <button className="text-white px-2 text-md" component='a'>{text}</button>
            </Link>
        </li>
    )
}