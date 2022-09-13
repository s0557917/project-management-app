import {Calendar, Flag, Tag, BellRinging} from "phosphor-react";
import { getPriorityColor } from "../../../utils/color/getPriorityColor";
import IconInformation from "../../general/icons/IconInformation";
import getCategoryColor from "../../../utils/color/getThemeColor";

export default function IconSection({ taskData, category, textColor }) {
    
    function formatData() {
        return taskData.dueDate && taskData.dueDate !== ''  
        ? <div>
            <p className="text-xs">
            {new Date(taskData.dueDate).toLocaleDateString('en-GB')}
            </p> 
            <p className="text-xs">
                {String(new Date(taskData.dueDate).getHours()).padStart(2, "0")}:{String(new Date(taskData.dueDate).getMinutes()).padStart(2, "0")}
            </p>
            </div>
        : '-';
    }
    
    return (
        <div className="flex items-center m-1 h-auto">
            <IconInformation width={'w-24'}>
                <Calendar size={24} className="m-1 drop-shadow-md shadow-black contrast-124"/>
                {formatData()}
            </IconInformation>

            <IconInformation width={'w-14'}>
                <Flag 
                    size={24} 
                    className="m-1 drop-shadow-md shadow-black contrast-125"
                    weight={'fill'} 
                    color={getPriorityColor(taskData.priority)} 
                />
                <p className="text-xs">P{taskData.priority}</p>
            </IconInformation>
            
            <IconInformation width={'w-24'}>
                <Tag 
                    size={24} 
                    weight={category ? 'fill' : 'regular'} 
                    color={category ? category.color : getCategoryColor('#1f2937','#ffffff')} 
                    className="m-1 drop-shadow-md shadow-black contrast-125"
                />
                <p className="text-xs">{category?.name || '-'}</p>
            </IconInformation>
            {/* <IconInformation>
                <BellRinging size={24} className="m-1 drop-shadow-md shadow-black"/>
            </IconInformation> */}
            <br/>
        </div>
    )
}