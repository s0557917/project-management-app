export function filterTasksToUserPreferences(task, categories, filters) {
    return hasDueDate(task) 
    && showCompletedTasks(task, filters) 
    && (isCategoryPresentAndActive(task, categories) || isCategoryNotPresentAndUncategorizedVisible(task, filters));
}

export function filterTasksToUserPreferenceAndPrio(task, categories, filters) {
    return showCompletedTasks(task, filters) 
    && (isCategoryPresentAndActive(task, categories) || isCategoryNotPresentAndUncategorizedVisible(task, filters));
}

export function hasDueDate(task) {
    return task.dueDate !== null 
      && task.dueDate !== undefined 
      && task.dueDate != '';
}

function showCompletedTasks(task, filters) {
    return !task.completed || filters?.find(filter => filter.name === 'Completed')?.value;
}

export function isCategoryPresentAndActive(task, categories) {
    return task.categoryId !== null 
        && task.categoryId !== undefined 
        && task.categoryId !== '' 
        && categories?.find(category => category.id === task.categoryId)?.active
}

export function isCategoryNotPresentAndUncategorizedVisible(task, filters) {
    return (task.categoryId === null
        || task.categoryId === undefined
        || task.categoryId === ''
    ) && filters?.find(setting => setting.name === 'Uncategorized')?.value
} 