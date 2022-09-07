const titlePadding = 35;
const categoryPadding = 20;
const datePadding = 20;

export function mapTasksToEditor(tasks, categories) {
    return tasks?.map(task => 
      mapSingleTask(task, categories)
    )
    .join('\n')
    .concat('\n');
}

export function mapTaskStructureToEditor(taskStructure, tasks, categories) {
    if(!taskStructure || !tasks || !categories) return [];
    const taskStr = taskStructure
    ?.sort((a, b) => a.startPos.l < b.startPos.l ? -1 : 1)
    ?.map((line, index) => {
        const task = tasks.find(task => task.id === line.id);
        return index < taskStructure.length - 1 ? mapSingleTask(task, categories).concat('\n') : mapSingleTask(task, categories);
    })
    ?.join('');

    return taskStr;
}

export function mapSingleTask(task, categories) {
    if(task && categories) {
        return `${task.id.substring(0,6)} ${mapTitle(task)} ${mapDetails(task)} ${mapCategory(categories, task.categoryId)} p\\${task.priority} ${mapDate(task)} ${task.completed ? 'x\\' : ''}`
    } else {
        return '';
    }
}

function mapTitle(task) {
    if(task.title && task.title.length < titlePadding) {
        return String(`t\\${task.title}`).padEnd(titlePadding);
    } else if(task.title && task.title.length >= titlePadding) {
        return String(`t\\${task.title.substring(0, titlePadding)}...`).padEnd(titlePadding);
    }
}

function mapDetails(task) {
    if(task.details && task.details.length < titlePadding) {
        return String(`d\\${task.details}`).padEnd(titlePadding);
    } else if(task.details && task.details.length >= titlePadding) {
        return String(`d\\${task.details.substring(0,15)}...`).padEnd(titlePadding);
    } else {
        return String('').padEnd(titlePadding);
    }
}

function mapCategory(categories, categoryId) {
    if(categoryId !== null && categoryId !== undefined && categoryId !== '') {
        return String(
            `c\\${categories?.find(category => category.id === categoryId)?.name}`
        ).padEnd(categoryPadding);
    } else {
        return String('c\\Uncategorized').padEnd(categoryPadding);
    }
}

function mapDate(task) {
    if(!task.dueDate) {
        return String('').padEnd(datePadding);
    } else {
        const date = new Date(task.dueDate);  
        const mappedDate = String(
            `dt\\${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
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