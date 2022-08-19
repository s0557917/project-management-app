import { Menu, ScrollArea, TextInput, ActionIcon } from '@mantine/core';
import { ArrowRight, Circle } from 'phosphor-react';

export default function SubtaskDialogue({ tasks, categories, selectedTask }) {

    return (
        <Menu shadow="md" width={200} position="top">
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
                            ?.filter((task) => task.id !== selectedTask.id)
                            ?.map((task) => 
                                <li 
                                    className='flex p-2 m-1 bg-zinc-700 text-xs rounded-sm cursor-pointer'
                                    onClick={() => console.log("CLICKED SUBTASK", task)}
                                >
                                    <Circle 
                                        size={16} 
                                        color={ task.categoryId !== '' && task.categoryId !== null 
                                            ? categories.find((category) => category.id === task.categoryId).color  
                                            : "#a39d9d"
                                        } 
                                        weight="fill" 
                                        className='mr-2'
                                    />
                                    {task.title}
                                </li>
                            )
                        }
                    </ul>
                </ScrollArea>
                <Menu.Divider></Menu.Divider>
                
                <TextInput 
                    // value={value} 
                    // onChange={(event) => setValue(event.currentTarget.value)} 
                    label="Create a new task"
                    placeholder='Title'
                    rightSection={
                        <button className='bg-cyan-500 hover:bg-cyan-700 p-1 rounded-full' onClick={() => console.log("CREATE NEW SUBTASK")}>
                          <ArrowRight size={18} weight="bold"/>
                        </button>
                    }
                />
            </Menu.Dropdown>
        </Menu>
    )
}