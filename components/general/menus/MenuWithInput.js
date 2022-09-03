import { Menu, ActionIcon, ScrollArea, TextInput } from '@mantine/core'
import { Tag, ArrowRight } from 'phosphor-react';

export default function MenuWithInput({ openedState, inputState, title, label, placeholder, icon, listContent }) {
    
    const [opened, setOpened] = openedState;
    const [inputText, setInputText] = inputState;

    return(
        <Menu shadow="md" width={200} opened={opened}>
            <Menu.Target>
                <button 
                    className='text-xl hover:bg-blue-700 bg-cyan-500 text-white rounded-full w-8 h-8' 
                    // onClick={() => }
                >
                    {icon}
                </button>
                {/* <ActionIcon>
                    <Tag size={60} color="cyan" weight="fill" />
                </ActionIcon> */}
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>{title}</Menu.Label>
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
                    value={inputText}
                    onChange={(event) => setInputText(event.currentTarget.value)} 
                    label={label}
                    placeholder={placeholder}
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
