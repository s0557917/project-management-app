import ListBlock from "../ListBlock/ListBlock";
import { filterTasksToUserPreferences } from "../../../utils/task-filtering/taskFiltering";

export default function PrioritySortingView({tasks, categories, onTaskClicked, onCompletionStateChanged, filters, theme}) {
    function generatePrioritySortedList() {
        const filteredAndSortedTasks = tasks
            ?.filter(task => filterTasksToUserPreferences(task, categories, filters))
            ?.sort((a, b) => b.priority - a.priority);

        return <ListBlock
            key={'priority-sorted'}
            tasks={filteredAndSortedTasks}
            categories={categories}
            onTaskClicked={onTaskClicked}
            onCompletionStateChanged={onCompletionStateChanged}
            category={''}
            title={'Priority'}
            active={true}
            theme={theme}
        />
    }

    return (
        <>
            {generatePrioritySortedList()}
        </>
    )

}