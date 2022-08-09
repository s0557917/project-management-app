import Task from "../Task"
import CategoryContainer from "./CategoryContainer"

export default function Category({tasks, onTaskClicked, onCompletionStateChanged, category, title}) {
    return (
        <CategoryContainer title={title}>
            <div>
                {tasks.map(task => {
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
    )
}