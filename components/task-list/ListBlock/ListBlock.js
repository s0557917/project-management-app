import getThemeColor from "../../../utils/color/getThemeColor";
import Task from "../task/Task"
import ListBlockContainer from "./ListBlockContainer"

export default function Category({tasks, categories, onTaskClicked, onCompletionStateChanged, category, title, active}) {
    
    function getCategory(task) {
        if(category) {
            return category;
        } else if(task.categoryId !== '' && categories) {
            return categories.find(category => category.id === task.categoryId);
        } else {
            return '';
        }
    }

    function generateCategoryContent() {
        const mappedTasks = tasks?.map(task => {
            return <Task 
                taskData={task} 
                onTaskClicked={onTaskClicked} 
                onCompletionStateChanged={onCompletionStateChanged}
                category={getCategory(task)} 
                key={task.id}
            />
        })

        return (mappedTasks?.length > 0 ? mappedTasks : <div className="p-2">No tasks in this category yet...</div>);
    }

    return (
        <div className={`rounded-md w-4/5 mx-auto ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
            {
                active &&
                <ListBlockContainer 
                    title={title || ''}
                    color={category?.color || ''}
                >
                    <div>
                        { generateCategoryContent() }
                    </div>
                </ListBlockContainer>
            }
        </div>
    )
}