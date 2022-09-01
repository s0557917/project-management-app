const titleRegex = /(?<=(?<!d)t\().*?(?=\))/;
const titleWithBracketsRegex = /(?<!d)t\(.*?\)/g;
const detailsRegex = /(?<=d\().*?(?=\))/;
const categoryRegex = /((?<=c\(|category\()[A-Z|a-z|0-9].*?(?=\)))/;
const prioRegex = /(?<=p\()[0-5](?=\))/;
const dateTimeRegex = /(?<=dt\(|datetime\()\d{2}[-]\d{2}[-]\d{4} \d{2}[:]\d{2}|\d{2}[-]\d{2}[-]\d{4}(?=\))/;

function formatDateTimeToObject(date) {
    const splitDateAndTime = date[0].split(' ');
    const splitDate = splitDateAndTime[0].split('-');
    
    if(splitDateAndTime.length === 2 && splitDate.length === 3) {
        return new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${splitDateAndTime[1].padEnd(8, ':00')}`);
    } else if (splitDateAndTime.length === 1 && splitDate.length === 3) {
        return new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T00:00:00`);
    } else {
        return undefined;
    }
}

export function runSyntaxCheck(text, categories) {  
    const openingTagsCount = text.match(/\(/g).length;
    const closingTagsCount = text.match(/\)/g).length;
    const tagsWithContent = text.match(/\(.*?\)/g);
    const datesWithBrackets = text.match(/dt\(.*?\)|datetime\(.*?\)/g); 
   
    const lineMatches = text.match(/.*?\n/g);

    let tagsCorrectness = [];
    let dateTimesCorrectness = [];
    let taskStructureCorrectness = [];
    let categoryExists = [];

    const errors = new Set();

    if(tagsWithContent !== null) {
        tagsCorrectness = tagsWithContent.map(match => match.match(/(?<=\().*?(?=\))/g)[0] !== '');
        if(tagsCorrectness?.includes(false)) errors.add("Check that all your tags have content!"); 
    }

    if(datesWithBrackets !== null) {
        dateTimesCorrectness = datesWithBrackets.map(date => {
            const dateMatch = date.match(dateTimeRegex);
            if(dateMatch !== null) {
                const dateObject = formatDateTimeToObject(dateMatch);
                if(!dateObject || isNaN(dateObject)) {
                    errors.add("A set date and/or time does not exist!");
                    return false;
                }
            } else {
                errors.add('A date and/or time is missing!');
                return false;
            }
            
        });
    }

    if(lineMatches !== null) {
        taskStructureCorrectness = lineMatches.map(line => {
            if(line.match(titleWithBracketsRegex) === null 
                && (
                    line.match(detailsRegex) !== null
                    || line.match(categoryRegex) !== null
                    || line.match(prioRegex) !== null
                    || line.match(dateTimeRegex) !== null
                )
            ) {
                errors.add("A task has to have and begin with a title!");
                return false;
            }
        });

        categoryExists = lineMatches.map(line => {
            const category = line.match(categoryRegex);
            
            if(category !== null && category[0] !== 'Uncategorized') {
                return categories.find(cat => cat.name === category[0]) !== undefined;
            }
        });
        if(categoryExists?.includes(false)) errors.add('One of the used categories does not exist!');
    }

    if(openingTagsCount !== closingTagsCount) errors.add('There is at least one missing tag!');

    return {
        isSyntaxValid: closingTagsCount === openingTagsCount 
            && !tagsCorrectness?.includes(false)
            && !dateTimesCorrectness?.includes(false)
            && !taskStructureCorrectness?.includes(false)
            && !categoryExists?.includes(false),
        errors: Array.from(errors)
    }
}

export function guaranteeCorrectTagSpacing(lines) {
    return lines.map(line => {
        let modifiedLine = line
            .replace(/\\t(?=[^\s](.*?))/g, '\\t ')
            .replace(/(?<=[^\s])t\\/g, ' t\\ ');
        return modifiedLine;
    });
}

export function splitContentIntoLines(debouncedEditorContent) {
    let editorContentLines = [];
    let currentLine = [];
    for(let i = 0; i <= debouncedEditorContent.length; i++) {
      if(debouncedEditorContent.charAt(i) === '\n' || i === debouncedEditorContent.length) {
        editorContentLines.push(`${currentLine.join('')}\n`);
        currentLine = [];
      } else {
        currentLine.push(debouncedEditorContent.charAt(i));
      }
    }
    return editorContentLines;
}

export function structureEditorContent(editorLines, tasks) {
    return editorLines
        .map((editorLine, i) => {
            const components = getTaskComponents(editorLine);
            if(components.title !== undefined) {
                const shortTaskId = editorLine.match(/.*?(?=t\()/);

                const fullTaskId = shortTaskId !== null 
                    ? tasks.find(task => {
                        return task.id.substring(0,4).trim() === shortTaskId[0].trim()
                    })?.id 
                    : undefined;
                return {
                    type: 'task',
                    id: fullTaskId,
                    startPos: {l: i + 1, c: 0},
                    endPos: {l: i + 1, c: editorLine.length},
                    content: editorLine,
                }
            } else if (editorLine !== '' || editorLine !== '\n') {
                return {
                    type: 'note',
                    startPos: {l: i + 1, c: 0},
                    endPos: {l: i + 1, c: editorLine.length},
                    content: editorLine,
                }
            }
        })
        .filter(line => line !== undefined);
}

export function getTaskComponents(line) {
    if(!line) return undefined;

    const titleMatches = line.match(titleRegex);
    const detailsMatches = line.match(detailsRegex);
    const priorityMatches = line.match(prioRegex);
    const dateTimeMatches = line.match(dateTimeRegex);
    const categoryMatches = line.match(categoryRegex);

    return {
        taskId: line.id,
        title: titleMatches !== null ? titleMatches[0].trim() : undefined,
        details: detailsMatches !== null ? detailsMatches[0].trim() : undefined,
        category: categoryMatches !== null ? categoryMatches[0].trim() : undefined,   
        priority: priorityMatches !== null ? parseInt(priorityMatches[0].trim()) : 1,
        dueDate: dateTimeMatches !== null ? dateTimeMatches[0].trim() : undefined,
    }
}

export function getChanges(previous, current) {
    return current.filter(task => {
        const previousTask = previous.find(previousTask => previousTask.id === task.id);
        
        if(previousTask !== undefined && task.type !== 'note') {
            const prevComponents = getTaskComponents(previousTask.content);
            const currComponents = getTaskComponents(task.content);

            if(prevComponents.title !== currComponents.title) {
                console.log("Title changed", task);
                return true;
            }
            if(prevComponents.details !== currComponents.details) {
                console.log("Details changed", task);
                return true;
            }
            if(prevComponents.category !== currComponents.category) {
                console.log("Category changed", task);
                return true;
            }
            if(prevComponents.priority !== currComponents.priority) {
                console.log("Priority changed", task);
                return true;
            }
            //TODO FIX DATE COMPARISON
            if(prevComponents.dueDate !== currComponents.dueDate) {
                console.log("DateTime changed", prevComponents.dueDate, " -- ", currComponents.dueDate);
                return true;
            }
        }

        return false;
    })
}

export function mapLineToTask(task, categories) {
    const taskComponents = getTaskComponents(task.content);
    return {
        id: task.id || undefined,
        title: taskComponents.title,
        details: taskComponents.details || '',
        completed: false,
        dueDate: new Date(taskComponents.dueDate) || null,
        priority: taskComponents.priority,
        categoryId: categories?.find(category => category.name === taskComponents.category)?.id || '',
        start: null,
        end: null,
        reminders: null,
        subtasks: null,
    }
}

export function ensureCorrectLineStartSpacing(editorContent) {
    return splitContentIntoLines(editorContent).map(line => {
        if(line === '\n') return '     ' + line; 
    });
}