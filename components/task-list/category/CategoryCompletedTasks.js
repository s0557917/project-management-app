import CategoryContainer from "./CategoryContainer"
import Task from "../Task"
import { useState } from "react"

export default function CategoryCompletedTasks({tasks, onTaskClicked, onCompletionStateChanged, active}){
    
    const [completedTasks, setCompletedTasks] = useState(tasks);

    return (
        <>
            {active &&
                <div className="rounded-md bg-zinc-800">
                    <CategoryContainer title={"Completed"}>
                        {tasks?.map(task => {
                            return <Task 
                                taskData={task} 
                                onTaskClicked={onTaskClicked} 
                                onCompletionStateChanged={onCompletionStateChanged}
                                category={task.category || '' } 
                                key={task.id}
                            />
                        })}
                    </CategoryContainer>
                </div>
            }
        </>
    )
}

