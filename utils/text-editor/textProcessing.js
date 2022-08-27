export function runSyntaxCheck(text) {
    const openingTagsCount = text.match(/\\t /g).length;
    const closingTagsCount = text.match(/t\\/g).length;
    const openingSubtaskTagsCount = text.match(/\\s /g)?.length || 0;
    const closingSubtaskTagsCount = text.match(/( s\\|s\\ )/g)?.length || 0;

    return closingTagsCount === openingTagsCount && closingSubtaskTagsCount === openingSubtaskTagsCount;
}

export function guaranteeCorrectTagSpacing(lines) {
    return lines.map(line => {
        let modifiedLine = line
            .replace(/\\t(?=[^\s](.*?))/g, '\\t ')
            .replace(/(?<=[^\s])t\\/g, ' t\\ ');
        return modifiedLine;
    });
}

//TODO FIX GETTING TITLE WHEN NO ID PRESENT
export function getTaskComponents(lines) {
    if(!lines) return [];
    // const fullTaskTitleRegex = /(?<!\\)\s([A-Z|a-z].*?)(?=\\ ?|t\\)/;
    const prioRegex = /\\p[0-5]/;
    const dateTimeRegex = /\d{2}[-]\d{2}[-]\d{4} \d{2}[:]\d{2}|\d{2}[-]\d{2}[-]\d{4}/;
    const categoryRegex = /\\[A-Z].*?(?=\s|\\)/;
    const titleRegex = /([A-Z|a-z|0-9].*?)(?=\\ ?|t\\)/;

    return lines.map(line => {
        const priorityMatches = line.content.match(prioRegex);
        const dateTimeMatches = line.content.match(dateTimeRegex);
        const titleMatches = line.content.substring(5).match(titleRegex);
        const categoryMatches = line.content.match(categoryRegex);

        return {
            ...line,
            components: {
                taskId: line.id,
                title: titleMatches !== null ? titleMatches[0].trim() : undefined,
                category: categoryMatches !== null ? categoryMatches[0] : undefined,   
                priority: priorityMatches !== null ? priorityMatches[0] : '\\p1',
                dateTime: dateTimeMatches !== null ? dateTimeMatches[0] : undefined,
            }
        }
    });
}

export function getChanges(previous, current) {
    return current.filter(task => {
        const previousTask = previous.find(previousTask => previousTask.id === task.id);

        if(previousTask !== undefined) {
            if(previousTask.components.title !== task.components.title) {
                console.log("Title changed", task);
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
            if(previousTask.components.dateTime !== task.components.dateTime) {
                console.log("DateTime changed", task);
                return true;
            }
        }

        return false;
    })
}

export function getTasks(unManagedContent) {
    const foundTasks = unManagedContent.match(/\\t(.*?)t\\/g);
    console.log("foundTasks", foundTasks);
    const foundTasksWithPosition = (foundTasks) => {
        // foundTasks.forEach(task => {
        //     const regex = new RegExp(`\\t ${task.id.sub}`, 'g');
        //     unManagedContent.match(/\\t task/g)
        // })
    }

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

export function getFoundTasksPositionAndId(foundTasks, editorContentLines, tasks) {
    return foundTasks
      .map(foundTask => {
        const shortTaskId = foundTask.split(' ')[1];
        const taskPosition = editorContentLines.findIndex(line => line.split(' ')[1] === shortTaskId);
        const fullTaskId = tasks.find(task => task.id.substring(0,4) === shortTaskId)
        const content = foundTask.match(/(?<=\\t)(.*)(?=t\\)/g)[0].trim();

        if(taskPosition !== -1) {
          return {
            type: 'task',
            id: fullTaskId !== undefined ? fullTaskId.id : undefined,
            startPos: {l: taskPosition + 1, c: 0},
            endPos: {l: taskPosition + 1, c: foundTask.length},
            content: content,
          }
        }
      })
      .filter(task => task !== undefined)
}