import { Menu, ActionIcon, ScrollArea, TextInput } from '@mantine/core'
import { Tag, ArrowRight } from 'phosphor-react';
import { useState } from 'react';
import CategoryListItem from '../category/CategoryListItem';

export default function FilteringMenu ({categories, activeCategoriesState}) {
    
    const [opened, setOpened] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [activeCategories, setActiveCategories] = activeCategoriesState;

    function onCategoryStatusChanged(category, status) {
        console.log("Category clicked: ", category, status);
        const modifiedCategoryIndex = activeCategories.findIndex((activeCategory) => activeCategory.id === category.id);
        const modifiedCategories = [...activeCategories];
        modifiedCategories[modifiedCategoryIndex].active = status;
        setActiveCategories(modifiedCategories);
    }

    function onCategoryAdded(categoryTitle) {
        console.log("Category added: " + categoryTitle);
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
                        {categories?.map((category) =>
                            <CategoryListItem 
                                key={category.id}
                                category={category}
                                circleSize={16}
                                onCategoryStatusChanged={onCategoryStatusChanged}
                                textSize={'text-xs'}
                                completed={ activeCategories.find(
                                    activeCategory => activeCategory.id === category.id)?.active
                                }
                            />
                        )}
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