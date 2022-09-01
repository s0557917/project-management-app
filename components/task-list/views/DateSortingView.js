import ListBlock from "../ListBlock/ListBlock";
import { filterTasksToUserPreferences } from "../../../utils/task-filtering/taskFiltering";
import { getUniqueDates } from "../../../utils/dates/getUniqueDates";

export default function DateSortingView({ tasks, categories, onTaskClicked, onCompletionStateChanged, filters}) {
    
    function generateDateSortedList() {

        const matchingTasks = tasks
        ?.filter(task => filterTasksToUserPreferences(task, categories, filters) /*&& new Date(task.dueDate) >= new Date()*/)
        ?.sort((a, b) => (new Date(a.dueDate).getTime() || -Infinity) - (new Date(b.dueDate).getTime() || -Infinity))
        
        return generateDateBlocks(matchingTasks);
    }

    function generateDateBlocks(sortedTasks) {
        const dates = getUniqueDates(sortedTasks);

        const mappedTasks = [...dates].map(date => {
            const tasksInDate = sortedTasks.filter(task => new Date(task.dueDate).toLocaleDateString('en-GB') === date);    
            return <ListBlock
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