import { Menu, ScrollArea, TextInput } from '@mantine/core'
import { Tag, ArrowRight } from 'phosphor-react';
import { useState } from 'react';
import CategoryFilter from '../category/CategoryFilter';
import Filter from './Filter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserSettings } from '../../../utils/db/settings';
import { updateCategory } from '../../../utils/db/categories';

export default function FilteringMenu ({categories, activeCategoriesState, userSettings, user}) {
    
    const queryClient = useQueryClient();
    
    const [opened, setOpened] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [activeCategories, setActiveCategories] = activeCategoriesState;
    
    const settingsMutation = useMutation(
        updatedUserSettings => updateUserSettings(updatedUserSettings),
        {onSuccess: async () => {
            queryClient.invalidateQueries('settings');
        }}
    );

    const categoryMutation = useMutation(
        (updatedCategoryId, updatedCategoryState) => updateCategory(updatedCategoryId, updatedCategoryState),
        {onSuccess: async () => {
            queryClient.invalidateQueries('settings');
        }}
    )
    
    async function onCategoryStatusChanged(category, status) {
        const modifiedTask = {...category, active: status};
        categoryMutation.mutate(category.id, modifiedTask);

        // await fetch(`/api/categories/${category.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(modifiedTask),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         const modifiedCategoryIndex = activeCategories.findIndex((activeCategory) => activeCategory.id === data.id);
        //         const modifiedCategories = [...activeCategories];
        //         modifiedCategories[modifiedCategoryIndex] = data;
        //         setActiveCategories(modifiedCategories);
        //     });
    }

    function onCategoryAdded(categoryTitle) {
        console.log("Category added: " + categoryTitle);
    }

    async function onFilterStatusChanged(filterName, status) {
        const index = userSettings.filters.findIndex(setting => setting.name === filterName);
        const modifiedSettings = [...userSettings.filters];
        modifiedSettings[index].value = status;
        const modifiedUserSettings = {...user.settings, filters: modifiedSettings};

        settingsMutation.mutate(modifiedUserSettings);
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <button onClick={() => console.log("TEST")}>
                    <Tag size={32} color="cyan" weight="fill" />
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Categories</Menu.Label>
                <ScrollArea style={{ height:100 }} offsetScrollbars>
                    <ul>
                        {
                            categories?.map((category) =>
                                <CategoryFilter 
                                    key={category.id}
                                    category={category}
                                    circleSize={16}
                                    onCategoryStatusChanged={onCategoryStatusChanged}
                                    textSize={'text-xs'}
                                    completed={ activeCategories.find(
                                        activeCategory => activeCategory.id === category.id)?.active
                                    }
                                />
                            )
                        }
                        {
                            userSettings?.filters.map((displaySetting) => {
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
            </Menu.Dropdown>
        </Menu>
    )
}