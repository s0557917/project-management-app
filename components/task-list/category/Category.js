import Task from "../Task"
import CategoryContainer from "./CategoryContainer"

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

        return (mappedTasks?.length > 0 ? mappedTasks : <div>No tasks in this category yet...</div>);
    }

    return (
        <div className="rounded-md bg-zinc-800 w-4/5 mx-auto">
            {
                active &&
                <CategoryContainer 
                    title={title || ''}
                    color={category?.color || ''}
                >
                    <div>
                        { generateCategoryContent() }
                    </div>
                </CategoryContainer>
            }
        </div>
    )
}