import { Menu, ScrollArea, TextInput, ActionIcon } from '@mantine/core';
import { ArrowRight, Circle } from 'phosphor-react';
import Subtask from '../task-list/Subtask';
import { useState } from 'react';

export default function SubtaskDialogue({ tasks, categories, onSubtaskClicked, onSubtaskAdded }) {
    
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [opened, setOpened] = useState(false);
    
    return (
        <Menu shadow="md" width={200} position="top" opened={opened} onChange={setOpened}>
            <Menu.Target>
                <button 
                    className='text-xl hover:bg-blue-700 bg-cyan-500 text-white rounded-full w-8 h-8' 
                    onClick={() => console.log("CLICKED ADD NEW TASK")}
                >
                    +
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Subtasks</Menu.Label>
                <ScrollArea style={{ height:100 }}>
                    <ul>
                        {tasks
                            ?.map((task) => 
                                <Subtask 
                                    key={task.id} 
                                    task={task} 
                                    categories={categories} 
                                    onSubtaskClicked={onSubtaskClicked} 
                                    textSize={'text-xs'}
                                    circleSize={16}
                                />
                            )
                        }
                    </ul>
                </ScrollArea>
                <Menu.Divider></Menu.Divider>
                
                <TextInput 
                    value={newTaskTitle} 
                    onChange={(event) => setNewTaskTitle(event.currentTarget.value)} 
                    label="Create a new task"
                    placeholder='Title'
                    rightSection={
                        <button 
                            className='bg-cyan-500 hover:bg-cyan-700 p-1 rounded-full' 
                            onClick={() => {
                                onSubtaskAdded(newTaskTitle);
                                setOpened(false);
                            }}
                        >
                          <ArrowRight size={18} weight="bold"/>
                        </button>
                    }
                />
            </Menu.Dropdown>
        </Menu>
    )
}