import { getAllTasks } from '../../../utils/db/queryFunctions/tasks';
import useDebounce from '../../../utils/hooks/useDebounce';
import { TextInput, ScrollArea } from '@mantine/core';
import { MagnifyingGlass } from "phosphor-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { getAllCategories } from '../../../utils/db/queryFunctions/categories';
import TaskEditorDialogue from '../../task-editor-dialogue/TaskEditorDialogue';
import getThemeColor from '../../../utils/color/getThemeColor';
import useOutsideAlerter from '../../../utils/hooks/useOutsideAlerter';
import { updateTask } from '../../../utils/db/queryFunctions/tasks';
import { showNotification } from '@mantine/notifications';
import { Circle } from "phosphor-react";

export default function SearchBar() {

    const [dropdownOpened, setDropdownOpened] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const debouncedSearchValue = useDebounce(searchValue, 300);
    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);

    const queryClient = useQueryClient();

    const textColor = getThemeColor('text-gray-900', 'text-white');
    const backgroundColor = getThemeColor('bg-gray-200', 'bg-zinc-800');
    const borderColor = getThemeColor('border-gray-300', 'border-zinc-700');
    const hoverColor = getThemeColor('hover:bg-gray-300', 'hover:bg-zinc-700');

    useEffect(() => {
        // console.log("OPENED TASK EDITOR", openedTaskEditor);
    }, [openedTaskEditor]);

    useEffect(() => {
        if(debouncedSearchValue && tasks) {
            const matchingTasks = tasks.filter(task => 
                task.title.toLowerCase().includes(debouncedSearchValue.toLowerCase())
            )

            if(matchingTasks.length > 0) {
                setSearchResults(matchingTasks);
                // setDropdownOpened(true);
            } else {
                setSearchResults([]);
                // setDropdownOpened(false);
            }
        } else {
            setSearchResults([]);
            // setDropdownOpened(false);
        }
    }, [debouncedSearchValue]);

    const updateTaskMutation = useMutation(
        (updatedTask) => updateTask(updatedTask),
        {onSuccess: async () => {
            queryClient.invalidateQueries('tasks');
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'Task updated successfully!',
            });
        }}
    )

    function onEditedTaskSaved(task, taskId) {
        if(task.title !== '') {
            updateTaskMutation.mutate({...task, id: taskId});
            setOpenedTaskEditor(false);
            setSelectedTask(null);
        } else {
            showNotification({
                autoClose: 3000,
                type: 'error',
                color: 'red',
                title: 'Please ensure that your task has a title!',
            });
        }
    }

    function onModalClosed() {
        setOpenedTaskEditor(false);
        setSelectedTask(null);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setDropdownOpened);

    const searchResultsListHeight = searchResults.length > 0 ? 250 : 50;

    return (
        <div 
            className="relative self-center mx-1 my-2 w-72"
            ref={wrapperRef}
        >
            <TextInput 
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value);
                    setDropdownOpened(true);
                }}
                placeholder={"Search..."}
                icon={<MagnifyingGlass size={16} />}
                onClick={() => setDropdownOpened(true)}
            />

            {dropdownOpened && 
                <div className={`${backgroundColor} ${borderColor} border-[1px] absolute py-2 w-72 h-auto flex flex-col rounded-sm z-10 m-2 items-start top-8 right-1`}>
                    <ScrollArea 
                        style={{ height: searchResultsListHeight, width: '100%' }} 
                        type="auto" 
                        offsetScrollbars
                    >
                        {searchResults.length > 0 
                            ? searchResults.map(result => {
                                const category = categories.find(category => category.id === result.categoryId);
                                const color = category && category !== null && category.color ? category.color : '#ababab'; 

                                return (
                                    <div
                                        className={`${backgroundColor} ${hoverColor} cursor-pointer w-full flex items-center justify-between active:scale-95 left-auto right-auto px-2 py-3 mx-2 border-y border-y-neutral-700`}
                                        onClick={() => {
                                            console.log("TASK CLICKED");
                                            setSelectedTask(result);
                                            setDropdownOpened(false);
                                            setOpenedTaskEditor(true);
                                        }}
                                    >
                                        <div 
                                            className="text-xs"
                                        >
                                            {result.title}
                                        </div>
                                        <div className='flex items-center mr-1'>
                                            <Circle size={15} color={color} weight="fill" />
                                            <p className='text-xs'>{category ? category.name : 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                )
                            }) 
                            : <div className='flex items-center h-[50px] mr-1'>
                                <p className={`text-xs ${textColor} px-2 py-1 mx-2 my-1 `}>No results found...</p>
                            </div>
                        }
                    </ScrollArea>
                </div>
            }

            <TaskEditorDialogue 
                tasks={tasks} 
                categories={categories}
                modalState={[openedTaskEditor, setOpenedTaskEditor]} 
                selectedTask={selectedTask}
                selectedTaskSetter={setSelectedTask}
                saveEditedTaskCallback={onEditedTaskSaved}
                saveNewTaskCallback={null}
                onModalClosed={onModalClosed}
            />
        </div>
    )
}