import ListBlock from "../ListBlock/ListBlock";
import { filterTasksToUserPreferenceAndPrio } from "../../../utils/task-filtering/taskFiltering";

export default function PrioritySortingView({tasks, categories, onTaskClicked, onCompletionStateChanged, filters, theme}) {
    function generatePrioritySortedList() {
        const filteredAndSortedTasks = tasks
            ?.filter(task => {
                const yes = filterTasksToUserPreferenceAndPrio(task, categories, filters);
                console.log("YES", yes);
                return yes;
            })
            ?.sort((a, b) => b.priority - a.priority);
        const prio = <ListBlock
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

        return prio;
    }

    return (
        <>
            {generatePrioritySortedList()}
        </>
    )

}