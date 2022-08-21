import { Menu, ScrollArea, TextInput } from '@mantine/core'
import { Tag, ArrowRight } from 'phosphor-react';
import { useState } from 'react';
import CategoryFilter from '../category/CategoryFilter';
import Filter from './Filter';

export default function FilteringMenu ({categories, activeCategoriesState, displaySettingsState, user}) {
    const [opened, setOpened] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [activeCategories, setActiveCategories] = activeCategoriesState;
    const [displaySettings, setDisplaySettings] = displaySettingsState;

    async function onCategoryStatusChanged(category, status) {
        const modifiedTask = {...category, active: status};

        await fetch(`/api/categories/${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedTask),
        })
            .then((response) => response.json())
            .then((data) => {
                const modifiedCategoryIndex = activeCategories.findIndex((activeCategory) => activeCategory.id === data.id);
                const modifiedCategories = [...activeCategories];
                modifiedCategories[modifiedCategoryIndex] = data;
                setActiveCategories(modifiedCategories);
            });
    }

    function onCategoryAdded(categoryTitle) {
        console.log("Category added: " + categoryTitle);
    }

    async function onFilterStatusChanged(filterName, status) {
        const index = displaySettings.findIndex(setting => setting.name === filterName);
        const modifiedSettings = [...displaySettings];
        modifiedSettings[index].value = status;
        const modifiedUserSettings = {...user.settings, filters: modifiedSettings};

        await fetch(`/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedUserSettings),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("User settings updated: ", data);
            setDisplaySettings(data.settings.filters);
        });
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
                            displaySettings?.map((displaySetting) => {
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