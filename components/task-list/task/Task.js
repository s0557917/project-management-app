import IconSection from "./IconSection"
import getThemeColor from "../../../utils/color/getThemeColor"

export default function Task({ taskData, onTaskClicked, onCompletionStateChanged, category }) {
    
    const textColor = getThemeColor('text-gray-900', 'text-white');

    return(
        <div className={`flex items-center border-y ${getThemeColor('bg-gray-200 hover:bg-gray-300 hover:rounded-sm border-y-gray-300', 'border-y-neutral-600 hover:bg-neutral-700 hover:rounded-sm')}`}>
            <div>
                <button 
                    className={`rounded-full w-7 h-7 mx-3 ${taskData.completed ? "bg-green-500 hover:bg-green-300 hover:border-white hover:border-2" : "bg-red-600 hover:bg-red-400 hover:border-white hover:border-2"}`}
                    onClick={() => {
                        onCompletionStateChanged(taskData.id, !taskData.completed)
                    }}
                >   
                </button>
            </div>
        <div 
            className="cursor-pointer h-16 w-full"
            onClick={() => onTaskClicked(taskData)}
        >
            <div className="h-full flex justify-between items-center">

                <div 
                    className="items-center m-1 h-auto grow-1 flex"
                >
                    {(taskData.completed) 
                        ? <div>
                            <p className={` text-sm pb-0.5 font-bold ${textColor}`}><s>{taskData.title}</s></p>
                            <p className={`text-xs font-light ${textColor}`}>{taskData.details}</p>
                        </div> 
                        : <div>
                            <p className={`text-sm pb-0.5 font-bold ${textColor}`}>{taskData.title}</p>
                            <p className={`text-xs font-light ${textColor}`}>{taskData.details}</p>
                            </div>
                    }
                </div>
                <IconSection 
                    taskData={taskData}
                    category={category}
                    textColor={textColor}
                />

            </div>
        </div>
        </div>
    )
}