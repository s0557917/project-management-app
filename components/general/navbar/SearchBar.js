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

export default function SearchBar() {

    const [dropdownOpened, setDropdownOpened] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [openedTaskEditor, setOpenedTaskEditor] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const debouncedSearchValue = useDebounce(searchValue, 300);
    const {data: tasks, isFetching: isFetchingTasks} = useQuery(['tasks'], getAllTasks);
    const {data: categories, isFetching: isFetchingCategories} = useQuery(['categories'], getAllCategories);

    const bgColor = getThemeColor('bg-white', 'bg-neutral-600');
    const queryClient = useQueryClient();

    useEffect(() => {
        if(debouncedSearchValue && tasks) {
            const matchingTasks = tasks.filter(task => 
                task.title.toLowerCase().includes(debouncedSearchValue.toLowerCase())
            )

            if(matchingTasks.length > 0) {
                setSearchResults(matchingTasks);
                setDropdownOpened(true);
            } else {
                setSearchResults([]);
                setDropdownOpened(false);
            }
        } else {
            setSearchResults([]);
            setDropdownOpened(false);
        }
    }, [debouncedSearchValue]);

    const updateTaskMutation = useMutation(
        (updatedTask) => updateTask(updatedTask),
        {onSuccess: async () => {
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'Task updated successfully!',
            });

            setSearchValue('');
            setSearchResults([]);
            setDropdownOpened(false);
            setOpenedTaskEditor(false);
            setSelectedTask(null);
            

            queryClient.invalidateQueries('tasks');
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

    return (
        <div 
            className="relative self-center mx-3 w-72"
            ref={wrapperRef}
        >
            <TextInput 
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={"Search..."}
                icon={<MagnifyingGlass size={16} />}
                onClick={() => searchResults.length > 0 ? setDropdownOpened(true) : null}
            />
            {dropdownOpened && 
                <div className={`${bgColor} absolute bg-neutral-500 w-72 h-auto flex flex-col rounded-sm z-10 m-2 items-start`}>
                    <ScrollArea 
                        style={{ height: 250 }} 
                        type="auto" 
                        offsetScrollbars
                    >
                        {searchResults.map(result => (
                            <button 
                                onClick={() => {
                                    setSelectedTask(result);
                                    setDropdownOpened(false);
                                    setOpenedTaskEditor(true);
                                }}
                                className={`${bgColor} hover:bg-neutral-700 active:scale-95 left-auto right-auto mx-2 my-1 w-64`}
                            >
                                {result.title}
                            </button>
                        ))}
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