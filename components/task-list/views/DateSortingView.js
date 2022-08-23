import Category from "../category/ListBlock";
import { filterTasksToUserPreferences } from "../../../utils/task-filtering/taskFiltering";

export default function DateSortingView({ tasks, categories, onTaskClicked, onCompletionStateChanged, userSettings}) {
    
    function generateDateSortedList() {

        const matchingTasks = tasks
        ?.filter(task => filterTasksToUserPreferences(task, categories, userSettings))
        ?.sort((a, b) => (new Date(a.dueDate).getTime() || -Infinity) - (new Date(b.dueDate).getTime() || -Infinity))
        
        return generateDateBlocks(matchingTasks);
    }

    function generateDateBlocks(sortedTasks) {
        const dates = new Set();
        sortedTasks.forEach(task => {
            if(task.dueDate) {
                dates.add(new Date(task.dueDate).toLocaleDateString('en-GB'));
            }
        });

        const mappedTasks = [...dates].map(date => {
            const tasksInDate = sortedTasks.filter(task => new Date(task.dueDate).toLocaleDateString('en-GB') === date);    
            return <Category
                key={date}
                tasks={tasksInDate}
                categories={categories}
                onTaskClicked={onTaskClicked}
                onCompletionStateChanged={onCompletionStateChanged}
                category={''}
                title={date === new Date().toLocaleDateString('en-GB') ? 'Today' : date}
                active={true}
            />
        })

        return mappedTasks;
    }

    return (
        <>
            {generateDateSortedList()}
        </>
    )
}