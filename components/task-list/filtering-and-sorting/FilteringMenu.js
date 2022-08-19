import { Menu, ActionIcon, ScrollArea, TextInput } from '@mantine/core'
import { Tag, ArrowRight } from 'phosphor-react';
import { useState } from 'react';

export default function FilteringMenu ({categories}) {
    
    const [opened, setOpened] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');

    return (
        <Menu shadow="md" width={200} opened={opened}>
            <Menu.Target>
                <ActionIcon>
                    <Tag size={60} color="cyan" weight="fill" />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Categories</Menu.Label>
                <ScrollArea style={{ height:100 }}>
                    <ul>
                        {/* {tasks
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
                        } */}
                    </ul>
                </ScrollArea>
                <Menu.Divider></Menu.Divider>
                
                <TextInput 
                    value={newCategoryTitle}
                    onChange={(event) => setNewCategoryTitle(event.currentTarget.value)} 
                    label="Create a new category"
                    placeholder='Category Name'
                    rightSection={
                        <button 
                            className='bg-cyan-500 hover:bg-cyan-700 p-1 rounded-full' 
                            onClick={() => {
                                // onSubtaskAdded(newTaskTitle);
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