import Link from 'next/link'
import getThemeColor from '../../../utils/color/getThemeColor';

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

    const border = text !== 'Calendar' ? getThemeColor('border-x  border-x-gray-400' , 'border-x border-x-zinc-900') : '';
    const activeColor = isActive() ? getThemeColor('bg-gray-400 border-x-gray-900', "bg-zinc-900 border-x-white") : getThemeColor('bg-gray-200 border-x-gray-900',"bg-zinc-700");
    const hoverAndTextColor = getThemeColor('hover:bg-gray-300' ,'hover:bg-zinc-600');  
    const fontColor = getThemeColor('text-gray-900', 'text-white');
    return(
        <li key={'task-list-tab'} className={`${border} ${activeColor} ${hoverAndTextColor} flex items-center cursor-pointer`}>
            <Link href={link}>
                <button className={`${ fontColor } px-2 text-md`} component='a'>{text}</button>
            </Link>
        </li>
    )
}