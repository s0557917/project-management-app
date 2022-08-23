export function filterTasksToUserPreferences(task, categories, userSettings) {
    return hasDueDate(task) 
    && showCompletedTasks(task, userSettings) 
    && (isCategoryPresentAndActive(task, categories) || isCategoryNotPresentAndUncategorizedVisible(task, userSettings));
}

export function hasDueDate(task) {
    return task.dueDate !== null 
      && task.dueDate !== undefined 
      && task.dueDate != '';
}

function showCompletedTasks(task, userSettings) {
    return !task.completed || userSettings?.filters?.find(filter => filter.name === 'Completed')?.value;
}

export function isCategoryPresentAndActive(task, categories) {
    return task.categoryId !== null 
        && task.categoryId !== undefined 
        && task.categoryId !== '' 
        && categories?.find(category => category.id === task.categoryId)?.active
}

export function isCategoryNotPresentAndUncategorizedVisible(task, userSettings) {
    return (task.categoryId === null
        || task.categoryId === undefined
        || task.categoryId === ''
    ) && userSettings?.filters?.find(setting => setting.name === 'Uncategorized')?.value
} 