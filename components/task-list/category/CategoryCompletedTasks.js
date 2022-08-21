import CategoryContainer from "./CategoryContainer"
import Task from "../Task"

export default function CategoryCompletedTasks({tasks, onTaskClicked, onCompletionStateChanged, category}){
    return (
        <CategoryContainer title={"Completed"}>
            <div>
                {tasks?.map(task => {
                    return <Task 
                        taskData={task} 
                        onTaskClicked={onTaskClicked} 
                        onCompletionStateChanged={onCompletionStateChanged}
                        category={task.category || '' } 
                        key={task.id}
                    />
                })}
            </div>
        </CategoryContainer>
    )
}

