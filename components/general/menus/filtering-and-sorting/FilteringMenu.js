import { Menu, ScrollArea, TextInput, createStyles  } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import { Tag, ArrowRight, Square } from 'phosphor-react';
import { useState } from 'react';
import CategoryFilter from '../../../task-list/category/CategoryFilter';
import Filter from './Filter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserSettings } from '../../../../utils/db/queryFunctions/settings'; 
import { updateCategory, addNewCategory } from '../../../../utils/db/queryFunctions/categories';

export default function FilteringMenu ({categories, userSettings, user}) {
        
    const queryClient = useQueryClient();
    
    const [opened, setOpened] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [selectedNewColor, setSelectedNewColor] = useState('');

    const settingsMutation = useMutation(
        (updatedUserSettings) => updateUserSettings(updatedUserSettings),
        {onSuccess: async () => {
            queryClient.invalidateQueries('settings');
        }}
    );

    const categoryStatusMutation = useMutation(
        (updatedCategory) => updateCategory(updatedCategory),
        {onSuccess: async () => {
            queryClient.invalidateQueries('categories');
        }}
    )
    
    const newCategoryMutation = useMutation(
        (newCategory) => addNewCategory(newCategory),
        {onSuccess: async () => {
            queryClient.invalidateQueries('categories');
        }}
    )

    async function onCategoryStatusChanged(category, status) {
        const modifiedCategory = {...category, active: status};
        categoryStatusMutation.mutate(modifiedCategory);
    }

    function onCategoryAdded(categoryTitle) {
        if(selectedNewColor == '' || categoryTitle == '') {
            showNotification({
                autoClose: 3000,
                type: 'error',
                color: 'red',
                title: 'Error creating your category',
                message: 'Please ensure that you select a color and a title for your category!'
            });
        } else {
            newCategoryMutation.mutate({name: categoryTitle, color: selectedNewColor});
            setSelectedNewColor('');
            setNewCategoryTitle('');
        }
        console.log("Category added: " + categoryTitle);
    }

    async function onFilterStatusChanged(filterName, status) {
        const index = userSettings.filters.findIndex(setting => setting.name === filterName);
        const modifiedSettings = [...userSettings.filters];
        modifiedSettings[index].value = status;
        const modifiedUserSettings = {...user.settings, filters: modifiedSettings};

        settingsMutation.mutate(modifiedUserSettings);
    }

    const useStyles = createStyles((theme) => ({
        dropdown : {
            marginRight: 50,
        },
        label : {
            color: theme.black,
        },
    }));
    const classes = useStyles();

    return (
        <Menu 
            shadow="md" 
            width={300} 
            classNames={{dropdown: classes.dropdown, label: classes.label}}
            onClose={() => {setSelectedNewColor(''); setNewCategoryTitle('');}}
        >
            <Menu.Target>
                <button 
                    className='hover:scale-110 active:scale-90 transition-all' 
                    onClick={() => console.log("TEST")}
                >
                    <Tag size={32} color="cyan" weight="fill" />
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Categories</Menu.Label>
                <ScrollArea style={{ height:100 }} offsetScrollbars>
                    <ul>
                        {
                            categories
                            ?.sort((a, b) => a.name.localeCompare(b.name))
                            ?.map((category) =>
                                <CategoryFilter 
                                    key={category.id}
                                    category={category}
                                    circleSize={16}
                                    onCategoryStatusChanged={onCategoryStatusChanged}
                                    textSize={'text-xs'}
                                    completed={ category?.active }
                                />
                            )
                        }
                        {userSettings?.filters
                            ?.sort((a, b) => a.name.localeCompare(b.name))
                            ?.map((displaySetting) => {
                                return (
                                    <Filter 
                                        key={displaySetting.id}
                                        filterName={displaySetting.name}
                                        textSize={'text-xs'}
                                        onFilterStatusChanged={onFilterStatusChanged}
                                        active={displaySetting.value}
                                    />
                                )
                            })
                        }
                    </ul>
                </ScrollArea>
                <Menu.Divider></Menu.Divider>
                
                <div className='flex items-center px-1 py-2'>
                    <Menu>
                        <Menu.Target>
                            <button className='hover:scale-105 active:scale-95 transition-all'>
                                <Square size={40} color={selectedNewColor} weight="fill" />
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <div className='grid grid-cols-3'>
                                <button onClick={() => setSelectedNewColor("#de1b1b")}><Square size={36} color="#de1b1b" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#de6c1b")}><Square size={36} color="#de6c1b" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#ded41b")}><Square size={36} color="#ded41b" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#80de1b")}><Square size={36} color="#80de1b" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#0f8717")}><Square size={36} color="#0f8717" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#0ffcfc")}><Square size={36} color="#0ffcfc" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#0fb1fc")}><Square size={36} color="#0fb1fc" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#0f1ffc")}><Square size={36} color="#0f1ffc" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#791bde")}><Square size={36} color="#791bde" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#c71bde")}><Square size={36} color="#c71bde" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#de1b76")}><Square size={36} color="#de1b76" weight="fill" /></button>
                                <button onClick={() => setSelectedNewColor("#000000")}><Square size={36} color="#000000" weight="fill" /></button>
                            </div>
                        </Menu.Dropdown>
                    </Menu>
                    <TextInput 
                        value={newCategoryTitle}
                        onChange={(event) => setNewCategoryTitle(event.currentTarget.value)} 
                        label="Create a new category"
                        placeholder='Category Name'
                        
                        rightSection={
                            <button 
                                className='bg-cyan-500 hover:bg-cyan-700 p-1 rounded-full' 
                                onClick={() => {
                                    onCategoryAdded(newCategoryTitle);
                                    setOpened(false);
                                }}
                            >
                                <ArrowRight size={18} weight="bold"/>
                            </button>
                        }
                    />
                </div>
            </Menu.Dropdown>
        </Menu>
    )
}