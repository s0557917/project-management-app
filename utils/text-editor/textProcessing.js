export function runSyntaxCheck(text) {
    const openingTagsCount = text.match(/\(/g).length;
    const closingTagsCount = text.match(/\)/g).length;

    return closingTagsCount === openingTagsCount;
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
                        // console.log("COMP", task.id.substring(0,4).trim(), " - ", shortTaskId[0].trim(), " == ", task.id.substring(0,4).trim() === shortTaskId[0].trim())
                        return task.id.substring(0,4).trim() === shortTaskId[0].trim()
                    })?.id 
                    : undefined;
                return {
                    type: 'task',
                    id: fullTaskId,
                    startPos: {l: i + 1, c: 0},
                    endPos: {l: i + 1, c: editorLine.length},
                    content: editorLine,
                    components: components
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

    const titleRegex = /(?<=(?<!d)t\().*?(?=\))/;
    const detailsRegex = /(?<=d\().*?(?=\))/;
    const categoryRegex = /((?<=c\(|category\()[A-Z].*?(?=\)))/;
    const prioRegex = /(?<=p\()[0-5](?=\))/;
    const dateTimeRegex = /(?<=dt\(|datetime\()\d{2}[-]\d{2}[-]\d{4} \d{2}[:]\d{2}|\d{2}[-]\d{2}[-]\d{4}(?=\))/;

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

        if(previousTask !== undefined) {
            if(previousTask.components.title !== task.components.title) {
                console.log("Title changed", task);
                return true;
            }
            if(previousTask.components.details !== task.components.details) {
                console.log("Details changed", task);
                return true;
            }
            if(previousTask.components.category !== task.components.category) {
                console.log("Category changed", task);
                return true;
            }
            if(previousTask.components.priority !== task.components.priority) {
                console.log("Priority changed", task);
                return true;
            }
            //TODO FIX DATE COMPARISON
            if(previousTask.components.dateTime !== task.components.dateTime) {
                console.log("DateTime changed", task);
                return true;
            }
        }

        return false;
    })
}

export function mapLineToTask(task, categories) {
    return {
        id: task.id || undefined,
        title: task.components.title,
        details: task.components.details || '',
        completed: false,
        dueDate: new Date(task.components.dueDate) || null,
        priority: task.components.priority,
        categoryId: categories?.find(category => category.name === task.components.category)?.id || '',
        start: null,
        end: null,
        reminders: null,
        subtasks: null,
    }
}