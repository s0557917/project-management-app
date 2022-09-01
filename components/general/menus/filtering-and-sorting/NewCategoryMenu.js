import { Menu, TextInput } from "@mantine/core";
import { Square, ArrowRight } from "phosphor-react";
import { useState } from "react";

export default function NewCategoryMenu({ onCategoryAdded, newColorState, newCategoryState, setOpened }) {
    const [selectedNewColor, setSelectedNewColor] = newColorState;
    const [newCategoryTitle, setNewCategoryTitle] = newCategoryState;

    return (
        <div className='flex items-end px-2'>
            <Menu>
                <Menu.Target>
                    <button className='hover:scale-105 active:scale-95 transition-all'>
                        <Square size={40} color={selectedNewColor || '#d4d4d4'} weight="fill" />
                    </button>
                </Menu.Target>
                <Menu.Dropdown>
                    <div className='grid grid-cols-3'>
                        <button onClick={() => 
                            {setSelectedNewColor("#de1b1b")
                            setOpened(false)
                        }}>
                                <Square size={36} color="#de1b1b" weight="fill" />
                        </button>
                        <button onClick={() => 
                            {setSelectedNewColor("#de6c1b")
                            setOpened(false)
                        }}>
                            <Square size={36} color="#de6c1b" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#ded41b");
                            setOpened(false);
                        }}>
                                <Square size={36} color="#ded41b" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#80de1b");
                            setOpened(false);
                        }}>
                                
                            <Square size={36} color="#80de1b" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#0f8717");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#0f8717" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#0ffcfc");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#0ffcfc" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#0fb1fc");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#0fb1fc" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#0f1ffc");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#0f1ffc" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#791bde");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#791bde" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#c71bde");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#c71bde" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#de1b76");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#de1b76" weight="fill" />
                        </button>
                        <button onClick={() => {
                            setSelectedNewColor("#000000");
                            setOpened(false);
                        }}>
                            <Square size={36} color="#000000" weight="fill" />
                        </button>
                    </div>
                </Menu.Dropdown>
            </Menu>
            <TextInput 
                value={newCategoryTitle}
                onChange={(event) => setNewCategoryTitle(event.currentTarget.value)} 
                // label="Create a new category"
                placeholder='Category Name'
                
                rightSection={
                    <button 
                        className='bg-cyan-500 hover:bg-cyan-700 p-1 rounded-full' 
                        onClick={() => {
                            setOpened(false);
                            onCategoryAdded(newCategoryTitle, selectedNewColor);
                        }}
                    >
                        <ArrowRight size={18} weight="bold"/>
                    </button>
                }
            />
        </div>
    )
}