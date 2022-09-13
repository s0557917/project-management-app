import ListBlock from "../ListBlock/ListBlock";
import Task from "../task/Task";
import ListBlockContainer from "../ListBlock/ListBlockContainer";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function SubtaskSortingView({ tasks, categories, onTaskClicked, onCompletionStateChanged }) {
    const backgroundColor = getThemeColor('bg-gray-200', 'bg-zinc-800');

    function generateSubtaskList() {
        
    }
    
    return <div>
        {
             tasks && tasks?.length > 0 
            ? tasks
                ?.sort((a, b) => b.subtasks.length - a.subtasks.length)
                ?.map(task => {
                    return <div className={`${backgroundColor} w-4/5 mx-auto rounded-md p-2 m-2`}>
                        <div className="my-6 mx-3 p-2">
                            <Task
                                taskData={task} 
                                onTaskClicked={onTaskClicked} 
                                onCompletionStateChanged={onCompletionStateChanged}
                                category={categories?.find(category => category.id === task.categoryId) || null}
                            />
                            {
                                task.subtasks.map(subtaskId => {
                                    const subtask = tasks?.find(task => task.id === subtaskId);
                                    const category = categories?.find(category => {
                                        if(subtask?.categoryId !== null && category.id === subtask?.categoryId) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
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
                    </div> 
                }) 
            :
            <div className={`rounded-md w-4/5 mx-auto ${backgroundColor}`}> 
                <ListBlockContainer 
                    title={'Subtasks'}
                    color={''}
                    displayIcons={false}
                >
                    <p className={`text-gray-900' text-md`}>
                        No tasks in this category yet...
                    </p>
                </ListBlockContainer>
            </div>
        }   
    </div>
}