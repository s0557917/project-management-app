import { mapSingleTaskFromComponents } from "./taskMapping";

const titleRegex = /(?<!d)t\\.*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<!d)t\\.*(?=$)|(?<!d)t\\.*(?=\n)/;
const titleContentRegex = /(?<=(?<!d)t\\).*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<=(?<!d)t\\).*(?=$)|(?<=(?<!d)t\\).*(?=\n)/;
const detailsRegex = /d\\.*?(?=[a-z|A-Z][a-z|A-Z]?\\)|d\\.*(?=$)|d\\.*(?=\n)/;
const detailsContentRegex = /(?<=d\\).*?(?=[a-z|A-Z][a-z|A-Z]?\\)|(?<=d\\).*(?=$)|(?<=d\\).*(?=\n)/;
const categoryRegex = /(?<=c\\).*?(?=\s*?[a-z|A-Z][a-z|A-Z]?\\)|(?<=c\\)\w*?(?=\s*?$)|(?<=c\\)\w*?(?=\s*?\n)/;
const prioRegex = /(?<=p\\)[1-5](?=\s*)|(?<=p\\)[1-5](?=\s*$)|(?<=p\\)[1-5](?=\s*\n)/;
const dateTimeRegex = /(?<=dt\\|)\d{2}[-]\d{2}[-]\d{4} \d{2}[:]\d{2}|\d{2}[-]\d{2}[-]\d{4}(?=\\)/;
const taskCompletedRegex = /x\\.*|.*x\\/;

const emptyTagRegex = /[t|c|dt|d|p]\\\s*(?=[t|c|dt|d|p][t|c|dt|d|p]?\\|$|\n)/g;

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
    if(text && text !== null && text !== '' && categories) {
        const errors = new Set();
        const splitText = splitContentIntoLines(text);

        let emptyTagsExist = false;
        let multipleEqualTagsInLine = false;
        let wrongPrioritiesExist = false;
        let linesWithoutTitleExist = false;
        let categoryExists = true;
        let missingPrioritiesExist = false;
        let dateTimesCorrectness = [];
        
        // Check for empty components
        const emptyTagsMatches = text.match(/[t|c|d|p|dt]\\\s*([t|x|c|d|p|dt]\\|$|\n)/g)
        if(emptyTagsMatches !== null) {
            emptyTagsExist = true;
            errors.add('Check that all your tags have content!');
        }
        //Check that priorities are correct
        const wrongPrioritiesMatches = text.match(/p\\[6-9]/g);
        if(wrongPrioritiesMatches !== null) {
            wrongPrioritiesExist = true;
            errors.add('A task can only have a priority from 1 to 5!');
        }

        if(splitText !== null && splitText.length > 0) {
            
            
            splitText.forEach((line, index) => {
                // Check that category is valid
                const categoryMatches = line.match(categoryRegex);
                if(categoryMatches && categoryMatches !== null && categoryMatches[0] && categoryMatches[0] !== 'Uncategorized') {
                    const category = categories.find(cat => cat.name === categoryMatches[0]) !== undefined;
                    if(!category) {
                        errors.add(`The category in line ${index + 1} does not exist!`)
                        categoryExists = false;
                    }
                }
                
                // Check that components are also only present once
                const titleMatches = line.match(new RegExp(titleRegex, 'g'));
                const detailsMatches = line.match(new RegExp(detailsRegex, 'g'));
                const dateTimeMatches = line.match(new RegExp(dateTimeRegex, 'g'));
                const priorityMatches = line.match(new RegExp(prioRegex, 'g'));
                const taskCompletedMatches = line.match(new RegExp(taskCompletedRegex, 'g'));

                if(titleMatches !== null && titleMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple titles in line ${index + 1}!`);
                } 
                
                if(detailsMatches !== null && detailsMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple details in line ${index + 1}!`);
                } 
                
                if (categoryMatches !== null && categoryMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple categories in line ${index + 1}!`);
                }
                
                if(dateTimeMatches !== null && dateTimeMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple due dates in line ${index + 1}!`);
                } 
                
                if(priorityMatches !== null && priorityMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple priorities in line ${index + 1}!`);
                } 
                
                if(taskCompletedMatches !== null && taskCompletedMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple task completed tags in line ${index + 1}!`);
                }

                //Check that priority is present 
                if(priorityMatches === null) {
                    missingPrioritiesExist = true;
                    errors.add(`There is no priority in line ${index + 1}!`);
                }

            });

            // Check that title is present
            const lineHasTitle = text.match(/(?<!d)t\\*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<!d)t\\.*?(?=$)|(?<!d)t\\.*?(?=\n)/g);
            splitText.forEach((line, index) => {
                if (!line.includes('t\\')) {
                    linesWithoutTitleExist = true;
                    errors.add(`Line ${index + 1} does not have a title!`);
                } 
            });
        }
        
        //Check that date is valid
        const fullDates = text.match(/dt\\.*?(?=[a-z|A-Z][a-z|A-Z]?\\)|dt\\.*(?=$)|dt\\.*(?=\n)/g);
        if(fullDates !== null) {
            dateTimesCorrectness = fullDates.map(date => {
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

        return {
            isSyntaxValid: !missingPrioritiesExist 
                && !linesWithoutTitleExist
                && !wrongPrioritiesExist
                && !emptyTagsExist
                && !dateTimesCorrectness?.includes(false)
                && categoryExists
                && !multipleEqualTagsInLine,
            errors: Array.from(errors)
        }
    } else {
        return {
            isSyntaxValid: false,
            errors: ['No text was provided!']
        }
    }
}

export function guaranteeCorrectFormatting(text) {
    if(text && text !== null && text !== '') {
        const splitText = splitContentIntoLines(text);
        return splitText.map(line => {
        if(line.match(prioRegex) === null) {
            console.log("LINE WITHOUT PRIORITY: ", line);
            const taskComponents = getTaskComponents(line);
            return mapSingleTaskFromComponents({...taskComponents, priority: 1});
        } else {
            return line;
        }
        }).join(''); 
    } else {
        return '';
    }
}

export function splitContentIntoLines(content) {
    if(content && content !== null && content.length > 0) {
        let editorContentLines = [];
        let currentLine = [];
        for(let i = 0; i <= content.length; i++) {
          if(content.charAt(i) === '\n' || i === content.length) {
            editorContentLines.push(`${currentLine.join('')}\n`);
            currentLine = [];
          } else {
            currentLine.push(content.charAt(i));
          }
        }

        return editorContentLines;
    }
}

export function structureEditorContent(editorLines, tasks) {
    const content = editorLines
        .map((editorLine, i) => {
            const components = getTaskComponents(editorLine);
            if(components.title !== undefined) {
                const shortTaskId = editorLine.match(/^\w{4}/);

                const fullTaskId = shortTaskId !== null 
                    ? tasks.find(task => {
                        return task.id.substring(0,4).trim() === shortTaskId[0].trim()
                    })?.id 
                    : undefined;
                return {
                    id: fullTaskId,
                    startPos: {l: i + 1, c: 0},
                    endPos: {l: i + 1, c: editorLine.length},
                }
            }
        })
        .filter(line => line !== undefined);

    return content;
}

export function areLinesEqual(firstLine, secondLine) {
    const firstLineComponents = getTaskComponents(firstLine); 
    const secondLineComponents = getTaskComponents(secondLine); 

    return {
        areEqual: 
            firstLineComponents.title === secondLineComponents.title
            && firstLineComponents.details === secondLineComponents.details
            && firstLineComponents.category === secondLineComponents.category
            && firstLineComponents.priority === secondLineComponents.priority
            && firstLineComponents.dueDate === secondLineComponents.dueDate
            && firstLineComponents.isCompleted === secondLineComponents.isCompleted,
        components: {...secondLineComponents}
    }
}

export function getLinesWithContent(editorContent) {
    return splitContentIntoLines(editorContent)
        .filter(line => line !== '' && line !== '\n');
}

export function getTaskComponents(line) {
    if(!line) return undefined;

    const titleMatches = line.match(titleContentRegex);
    const detailsMatches = line.match(detailsContentRegex);
    const priorityMatches = line.match(prioRegex);
    const dateTimeMatches = line.match(dateTimeRegex);
    const categoryMatches = line.match(categoryRegex);
    const taskCompleted = line.match(taskCompletedRegex);

    return {
        taskId: line.id,
        title: titleMatches !== null ? titleMatches[0].trim() : undefined,
        details: detailsMatches !== null ? detailsMatches[0].trim() : undefined,
        category: categoryMatches !== null ? categoryMatches[0].trim() : undefined,   
        priority: priorityMatches !== null ? parseInt(priorityMatches[0].trim()) : 1,
        dueDate: dateTimeMatches !== null ? dateTimeMatches[0].trim() : undefined,
        isCompleted: taskCompleted !== null ? true : false
    }
}

export function compareTasks(previous, current) {
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

export function displayCompletedTasks(editorLines, oldDecorations, editorRef) {
    const completedLines = editorLines
    ?.map((line, index) => {
        if(line.match(taskCompletedRegex) !== null) {
            return {
                range: new monaco.Range(index + 1, 1, index + 1, 1),
                options: {
                  isWholeLine: true,
                  inlineClassName: 'completedTaskTextEditor',
                },
              };
        } else { 
            return undefined;
        }
    })
    ?.filter(line => line !== undefined);
    const delta = editorRef.current.deltaDecorations(
        oldDecorations, 
        completedLines
    );
    return delta;
}