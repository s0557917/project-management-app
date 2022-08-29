const titlePadding = 30;
const categoryPadding = 18;
const datePadding = 16;

export function mapTasksToEditor(tasks, categories) {
    return tasks?.map(task => 
      mapSingleTask(task, categories)
    )
    .join('\n')
    .concat('\n');
}

export function mapSingleTask(task, categories) {
    return `${task.id.substring(0,4)} ${String('t('+ task.title + ')').padEnd(titlePadding)} ${task.details !== '' ? String('d('+ task.details + ')').padEnd(titlePadding) : String('').padEnd(titlePadding)} ${mapCategory(categories, task.categoryId)} p(${task.priority}) ${mapDate(task)}`
}

function mapCategory(categories, categoryId) {
    if(categoryId !== null && categoryId !== undefined && categoryId !== '') {
        return String(
            `c(${categories?.find(category => category.id === categoryId)?.name})`
        ).padEnd(categoryPadding);
    } else {
        return String('c(Uncategorized)').padEnd(categoryPadding);
    }
}

function mapDate(task) {
    if(!task.dueDate) {
        return String('').padEnd(datePadding);
    } else {
        const date = new Date(task.dueDate);  
        const mappedDate = String(
            `dt(${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")})`
        );

        return mappedDate.padEnd(datePadding);
    }
        
}
    
function mapSubtasks(tasks, subtasks, categories) {
    if(subtasks === null || subtasks === undefined || subtasks.length === 0) {
        return '';
    } else {
        const mappedSubtasks = subtasks?.map(subtask => 
            {   const task = tasks.find(task => task.id === subtask);
                if(task) return `\t\\s ${mapSingleTask(task, categories)}s\\ `
            }
        ).join('\n');
        
        return `\n${mappedSubtasks}\n`;
    }
}