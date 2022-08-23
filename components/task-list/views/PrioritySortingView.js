import Category from "../category/ListBlock";
import { filterTasksToUserPreferences } from "../../../utils/task-filtering/taskFiltering";

export default function PrioritySortingView({tasks, categories, onTaskClicked, onCompletionStateChanged, userSettings, theme}) {
    function generatePrioritySortedList() {
        const filteredAndSortedTasks = tasks
            ?.filter(task => filterTasksToUserPreferences(task, categories, userSettings))
            ?.sort((a, b) => b.priority - a.priority);

        return <Category
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