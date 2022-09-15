import { titleRegex, titleContentRegex, detailsRegex, detailsContentRegex, categoryRegex, prioRegex, dateTimeContentRegex, taskCompletedRegex } from "./regex";

import dayjs from "dayjs";

const emptyTagRegex = /[t|c|dt|d|p]\\\s*(?=[t|c|dt|d|p][t|c|dt|d|p]?\\|$|\n)/g;

function formatDateTimeToObject(date) {
    const splitDateAndTime = date.split(' ');
    const splitDate = splitDateAndTime[0].split('-');

    if(splitDateAndTime.length === 1) {
        const startTime = new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T00:00:00`); 
        if(dayjs(startTime, true).isValid()) {
            return {start: startTime, end: undefined};
        } else {
            return undefined;
        }
    } else if(splitDateAndTime.length === 2) {
        const splitTimes = splitDateAndTime[1].split('-');
        const splitStartTime = splitTimes[0].split(':');
        const splitEndTime = splitTimes[1].split(':');

        const startTime = new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${splitTimes[0]}:00`);
        let endTime = new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${splitTimes[1]}:00`);

        if(splitStartTime > splitEndTime) {
            endTime = dayjs(endTime).add(1, 'day').toDate();
        }

        if(dayjs(startTime, true).isValid() && dayjs(endTime, true).isValid()) {
            return {start: startTime, end: endTime};
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export function runSyntaxCheck(text, categories) {
    
    if(text === '') return {isSyntaxValid: true, errors: []};
    
    if(text && text !== null && text !== '' && categories) {
        const errors = new Set();
        const splitText = splitContentIntoLines(text);

        let emptyTagsExist = false;
        let multipleEqualTagsInLine = false;
        let wrongPrioritiesExist = false;
        let linesWithoutTitleExist = false;
        let categoryExists = true;
        let missingPrioritiesExist = false;
        let multipleDateTimeTagsExist = false;
        let invalidDateTimesExist = false;
        
        //Check that priorities are correct
        
        if(splitText !== null && splitText.length > 0) {
            
            splitText.forEach((line, index) => {
                // Check for empty components
                const emptyTagsMatches = line.match(/[t|c|d|p|dt]\\\s*([t|x|c|d|p|dt]\\|$|\n)/g)
                if(emptyTagsMatches !== null) {
                    emptyTagsExist = true;
                    errors.add(`A tag in line ${index + 1} has no content!`);
                }
                
                const wrongPrioritiesMatches = line.match(/p\\[6-9]/g);
                if(wrongPrioritiesMatches !== null) {
                    wrongPrioritiesExist = true;
                    errors.add(`Line ${index + 1} contains a wrong priority! Only priorities from line 1 to 5 are allowed.`);
                }

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
                const titleContentMatches = line.match(new RegExp(titleContentRegex, 'g'));
                const detailsMatches = line.match(new RegExp(detailsRegex, 'g'));
                const dateTimeContentMatches = line.match(dateTimeContentRegex);
                const priorityMatches = line.match(new RegExp(prioRegex, 'g'));
                const taskCompletedMatches = line.match(new RegExp(taskCompletedRegex, 'g'));

                if (!line.includes('t\\')) {
                    linesWithoutTitleExist = true;
                    errors.add(`Line ${index + 1} does not have a title!`);
                } 

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
                
                
                if(priorityMatches !== null && priorityMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple priorities in line ${index + 1}!`);
                } 
                
                if(taskCompletedMatches !== null && taskCompletedMatches.length > 1) {
                    multipleEqualTagsInLine = true;
                    errors.add(`There are multiple task completed tags in line ${index + 1}!`);
                }
                
                //Check that priority is present
                // if(emptyTagsMatches === null && priorityMatches === null) {
                //     missingPrioritiesExist = true;
                //     errors.add(`There is no priority in line ${index + 1}!`);
                // }
                
                //Check if dueDate is present and if its correct
                if(dateTimeContentMatches !== null) {
                    if (dateTimeContentMatches.length === 1) {
                        const dateObject = formatDateTimeToObject(dateTimeContentMatches[0]);
                        if(!dateObject) {
                            errors.add(`The due date in line ${index + 1} does not exist!`);
                            invalidDateTimesExist = true;
                        }
                    } else if(dateTimeContentMatches.length > 1) {
                        multipleDateTimeTagsExist = true;
                        errors.add(`There are multiple due dates in line ${index + 1}!`);
                        
                        dateTimeContentMatches.forEach((dateTimeContent) => {
                            const dateObject = formatDateTimeToObject(dateTimeContent);
                            if(!dateObject) {
                                errors.add(`The due date in line ${index + 1} does not exist!`);
                                invalidDateTimesExist = true;
                            }
                        });
                    }
                } else if(line.includes('dt\\') && dateTimeContentMatches === null ){
                    errors.add(`The due date in line ${index + 1} is not valid!`);
                    invalidDateTimesExist = true;
                }
            });

            // Check that title is present
            splitText.forEach((line, index) => {

            });
        }

        return {
            isSyntaxValid: !invalidDateTimesExist 
                && !multipleDateTimeTagsExist
                && !missingPrioritiesExist 
                && !linesWithoutTitleExist
                && !wrongPrioritiesExist
                && !emptyTagsExist
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
            && areDueDatesEqual(firstLineComponents, secondLineComponents)
            && firstLineComponents.isCompleted === secondLineComponents.isCompleted,
        components: {...secondLineComponents}
    }
}

function areDueDatesEqual(firstComponent, secondComponent) {
    console.log("firstComponent", firstComponent, "secondComponent", secondComponent);
    const areEqual = firstComponent.dueDate === secondComponent.dueDate && firstComponent.end === secondComponent.end;
    console.log(firstComponent, " == ", secondComponent, " : ", areEqual);
    return areEqual;
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
    const dateTimeMatches = line.match(dateTimeContentRegex);
    const categoryMatches = line.match(categoryRegex);
    const taskCompleted = line.match(taskCompletedRegex);

    let dateObject = null;
    if(dateTimeMatches !== null) {
        dateObject = formatDateTimeToObject(dateTimeMatches[0]?.trim());
    }

    console.log("dateObject", dateObject);

    return {
        taskId: line.id,
        title: titleMatches !== null ? titleMatches[0].trim() : undefined,
        details: detailsMatches !== null ? detailsMatches[0].trim() : undefined,
        category: categoryMatches !== null ? categoryMatches[0].trim() : undefined,   
        priority: priorityMatches !== null ? parseInt(priorityMatches[0].trim()) : 1,
        dueDate: dateObject && dateObject !== null ? dateObject.start : undefined,
        start: dateObject && dateObject !== null ? dateObject.start : undefined,
        end: dateObject && dateObject !== null && dateObject.end !== undefined ? dateObject.end : undefined,
        isCompleted: taskCompleted !== null ? true : false
    }
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
    if(editorLines && editorLines[0] !== '') {
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
            const delta = editorRef?.current?.deltaDecorations(
                oldDecorations, 
                completedLines
            );
        return delta;
    }
}