const titlePadding = 30;
const categoryPadding = 15;
const datePadding = 16;


export default function mapTasksToEditor(tasks, categories) {
    return tasks?.map(task => 
      `\\t ${task.title.padEnd(titlePadding)} ${mapCategory(categories, task.categoryId)} \\p${task.priority} ${mapDate(task)} ${mapSubtasks(tasks, task.subtasks, categories)}t\\ `
    ).join('\n');
}


function mapCategory(categories, categoryId) {
    if(categoryId !== null && categoryId !== undefined && categoryId !== '') {
        return String(
            `\\${categories?.find(category => category.id === categoryId)?.name}`
        ).padEnd(categoryPadding);
    } else {
        return String('\\Uncategorized').padEnd(categoryPadding);
    }
}

function mapDate(task) {
    if(!task.dueDate) {
        return String('').padEnd(datePadding);
    } else {
        const date = new Date(task.dueDate);  
        const mappedDate = String(
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
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

function mapSingleTask(task, categories) {
    return `${task.title.padEnd(30)} ${mapCategory(categories, task.categoryId)} \\p${task.priority} ${mapDate(task)}`
}