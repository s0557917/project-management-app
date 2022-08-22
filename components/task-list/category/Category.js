import Task from "../Task"
import CategoryContainer from "./CategoryContainer"
import { useState } from "react"

export default function Category({tasks, onTaskClicked, onCompletionStateChanged, category, title, active}) {
    
    return (
        <>
            {active &&
                <CategoryContainer 
                    title={title}
                    color={category.color}
                >
                    <div>
                        { tasks?.map(task => {
                            if(!task.completed) {
                                return <Task 
                                    taskData={task} 
                                    onTaskClicked={onTaskClicked} 
                                    onCompletionStateChanged={onCompletionStateChanged}
                                    category={category.name || ''} 
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