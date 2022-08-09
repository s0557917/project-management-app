import {Calendar, Flag, Tag, BellRinging} from "phosphor-react";
import IconInformation from "../task-editor-dialogue/IconInformation";

export default function Task({ taskData, onTaskClicked, onCompletionStateChanged, category }) {
    return(
        <div className="flex items-center">
            <div>
                <button 
                    className={`rounded-full w-10 h-10 m-3 ${taskData.completed ? "bg-green-500 hover:bg-green-300 hover:border-white hover:border-2" : "bg-red-600 hover:bg-red-400 hover:border-white hover:border-2"}`}
                    onClick={() => onCompletionStateChanged(taskData.id, !taskData.completed)}
                >   
                </button>
            </div>
        <div 
            className="cursor-pointer h-16 border-2 border-cyan-500 hover:bg-cyan-700 p-2 m-2 rounded w-full"
            onClick={() => onTaskClicked(taskData)}
        >
            <div className="h-full flex justify-between items-center">

                <div 
                    className="items-center m-1 h-auto grow-1 flex"
                >
                    {(taskData.completed) 
                        ? <h2><s>{taskData.title}</s></h2> 
                        : <h2>{taskData.title}</h2>}
                </div>

                <div 
                    className="flex items-center m-1 h-auto"
                >
                    <IconInformation
                        state={taskData.dueDate}
                    >
                        <Calendar size={28} className="m-1"/>
                    </IconInformation>

                    <IconInformation
                        state={taskData.priority}
                    >
                        <Flag size={28} className="m-1"/>
                    </IconInformation>
                    <IconInformation
                        state={category}
                    >
                        <Tag size={28} className="m-1"/>
                    </IconInformation>
                    <IconInformation
                    >
                        <BellRinging size={28} className="m-1"/>
                    </IconInformation>
                    <br/>
                </div>
            </div>
        </div>
        </div>
    )
}