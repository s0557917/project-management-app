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

export function mapTaskStructureToEditor(taskStructure, tasks, categories) {
    if(!taskStructure || !tasks || !categories) return [];

    return taskStructure
    ?.sort((a, b) => a.startPos.l < b.startPos.l ? -1 : 1)
    ?.map(line => {
        if(line.type === 'task') {
            const task = tasks.find(task => task.id === line.id);
            return mapSingleTask(task, categories);
            // return mapSingleTaskFromComponents(
            //     line.id, 
            //     line.components.title, 
            //     line.components.details,
            //     line.components.category,
            //     line.components.priority,
            //     line.components.dueDate,
            // );
        } else if(line.type === 'note') {
            return line.content;
        }
    })
    ?.join('');
}

export function mapSingleTaskFromComponents(id, title, details, category, priority, duedate) {
    return `${id.substring(0,4)} ${String('t('+ title + ')').padEnd(titlePadding)} ${details && details !== '' ? String('d('+ details + ')').padEnd(titlePadding) : String('').padEnd(titlePadding)} ${String(`c(${category})`).padEnd(categoryPadding)} p(${priority}) ${duedate ? String(`dt(${duedate})`) : ''}\n`;
}

export function mapSingleTask(task, categories) {
    if(task && categories) {
        return `${task.id.substring(0,4)} ${String('t('+ task.title + ')').padEnd(titlePadding)} ${task.details !== '' ? String('d('+ task.details + ')').padEnd(titlePadding) : String('').padEnd(titlePadding)} ${mapCategory(categories, task.categoryId)} p(${task.priority}) ${mapDate(task)}\n`
    } else {
        return '';
    }
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