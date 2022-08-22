import Task from "../Task"
import CategoryContainer from "./CategoryContainer"
import { useState } from "react"

export default function Category({tasks, onTaskClicked, onCompletionStateChanged, category, title, active}) {
    
    const [categoryTasks, setCategoryTasks] = useState(tasks);

    return (
        <>
            {active &&
                <CategoryContainer 
                    title={title}
                    color={category.color}
                >
                    <div>
                        { categoryTasks?.map(task => {
                            if(!task.completed) {
                                return <Task 
                                    taskData={task} 
                                    onTaskClicked={onTaskClicked} 
                                    onCompletionStateChanged={onCompletionStateChanged}
                                    category={(category.id === task.category)?.name || '' } 
                                    key={task.id}
                                />
                            }
                        }
                        )}
                    </div>
                </CategoryContainer>
            }
        </>
    )
}