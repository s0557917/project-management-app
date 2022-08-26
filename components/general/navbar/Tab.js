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
    
    const border = text !== 'Calendar' ? getThemeColor('border-x' , 'border-x') : '';
    const activeColor = isActive() ? getThemeColor('bg-gray-400', "bg-zinc-900") : getThemeColor('bg-gray-200',"bg-zinc-700");
    const hoverAndTextColor = getThemeColor('hover:bg-gray-300' ,'hover:bg-zinc-600');  
    const fontColor = getThemeColor('text-gray-900', 'text-white');
    return(
            <Link key={`${text}-tab`} href={link}>
                <button className={`${ fontColor } px-2 text-md ${border} ${activeColor} ${hoverAndTextColor} ${getThemeColor('border-x-gray-400', 'border-x-zinc-900')} flex items-center cursor-pointer`} component='a'>{text}</button>
            </Link>
    )
}