import {Calendar, Flag, Tag, BellRinging} from "phosphor-react";
import IconInformation from "../task-editor-dialogue/IconInformation";

export default function Task({ taskData, onTaskClicked, category }) {
    return(
        <div onClick={() => onTaskClicked(taskData)} className="relative border-2 border-cyan-500 hover:bg-cyan-700 p-2 m-2 rounded w-full">
            <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-rose-600 bg-rose-600 checked:bg-emerald-400 checked:border-emerald-400 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1"></input>
            <label className="form-check-label inline-block" htmlFor="flexRadioDefault1">
                <div>
                    <div className="absolute inset-y-0 left-10 flex items-center m-1">
                        {(taskData.completed) 
                            ? <h2><s>{taskData.title}</s></h2> 
                            : <h2>{taskData.title}</h2>}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center m-1">
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
            </label>
        </div>
    )
}