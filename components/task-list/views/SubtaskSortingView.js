import ListBlock from "../ListBlock/ListBlock";
import Task from "../task/Task";

export default function SubtaskSortingView({ tasks, categories, onTaskClicked, onCompletionStateChanged }) {
    return <div>
        {
            tasks
            ?.sort((a, b) => b.subtasks.length - a.subtasks.length)
            ?.map(task => {
                return <div className="bg-gray-500 rounded-md p-2 m-2">
                    <Task
                        taskData={task} 
                        onTaskClicked={onTaskClicked} 
                        onCompletionStateChanged={onCompletionStateChanged}
                        category={categories?.find(category => category.id === task.categoryId) || null}
                    />
                    {
                        task.subtasks.map(subtaskId => {
                            const subtask = tasks?.find(task => task.id === subtaskId);
                            const category = categories?.find(category => category.id === subtask.categoryId);
                            return <Task
                                taskData={subtask}
                                onTaskClicked={onTaskClicked}
                                onCompletionStateChanged={onCompletionStateChanged}
                                category={category || null}
                                key={subtaskId}
                                indent={true}
                            />
                        })
                    }
                </div> 
            })
        }   
    </div>
}