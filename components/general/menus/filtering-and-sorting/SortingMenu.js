import { Menu, ScrollArea, TextInput } from '@mantine/core'
import { FunnelSimple, Calendar, Tag } from 'phosphor-react'
import { useState } from 'react'

export default function SortingMenu ({ sortingMethodSetter }) {
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <button>
                    <FunnelSimple size={32} color="cyan" weight="fill" /> 
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Sort by:</Menu.Label>
                <Menu.Item 
                    icon={<Calendar size={18} />}
                    onClick={() => sortingMethodSetter('date')} 
                >
                    Date
                </Menu.Item>
                <Menu.Item 
                    icon={<Tag size={18} weight="fill" />}
                    onClick={() => sortingMethodSetter('category')} 
                >
                    Category
                </Menu.Item>
                <Menu.Item 
                    icon={<p className='text-lg font-bold'>P</p>}
                    onClick={() => sortingMethodSetter('priority')} 
                >
                    Priority
                </Menu.Item>

            </Menu.Dropdown>
        </Menu>
    )
}