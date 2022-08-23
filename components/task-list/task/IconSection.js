import {Calendar, Flag, Tag, BellRinging} from "phosphor-react";
import { getPriorityColor } from "../../../utils/color/getPriorityColor";
import IconInformation from "../../general/icons/IconInformation";

export default function IconSection({ taskData, category }) {
    
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
        : null
    }
    
    return (
        <div className="flex items-center m-1 h-auto">
            <IconInformation width={'w-24'}>
                <Calendar size={24} className="m-1"/>
                {formatData()}
            </IconInformation>

            <IconInformation width={'w-14'}>
                <Flag 
                    size={24} 
                    className="m-1"
                    weight={'fill'} 
                    color={getPriorityColor(taskData.priority)} 
                />
                <p className="text-xs">P{taskData.priority}</p>
            </IconInformation>
            
            <IconInformation width={'w-24'}>
                <Tag 
                    size={24} 
                    weight={category ? 'fill' : 'regular'} 
                    color={category ? category.color : '#ffffff'} 
                    className="m-1"
                />
                <p className="text-xs">{category?.name}</p>
            </IconInformation>

            <IconInformation>
                <BellRinging size={24} className="m-1"/>
            </IconInformation>
            <br/>
        </div>
    )
}