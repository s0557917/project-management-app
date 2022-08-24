import { Menu } from '@mantine/core'
import { FunnelSimple, Calendar, Tag } from 'phosphor-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSorting } from '../../../../utils/db/queryFunctions/settings'

export default function SortingMenu () {
    const queryClient = useQueryClient()
    const updateSortingMutation = useMutation(
        (updatedSorting) => updateSorting(updatedSorting),
        {onSuccess: async () => {
            queryClient.invalidateQueries('sorting')
        }}
    )

    return (
        <div className='flex items-center'>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <button className='hover:scale-110 active:scale-90 transition-all'>
                        <FunnelSimple size={32} color="#16a34a" weight="fill" /> 
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Sort by:</Menu.Label>
                    <Menu.Item 
                        icon={<Calendar size={18} />}
                        onClick={() => updateSortingMutation.mutate('date')} 
                    >
                        Date
                    </Menu.Item>
                    <Menu.Item 
                        icon={<Tag size={18} weight="fill" />}
                        onClick={() => updateSortingMutation.mutate('category')} 
                    >
                        Category
                    </Menu.Item>
                    <Menu.Item 
                        icon={<p className='text-lg font-bold'>P</p>}
                        onClick={() => updateSortingMutation.mutate('priority')} 
                    >
                        Priority
                    </Menu.Item>

                </Menu.Dropdown>
            </Menu>
            {/* <p className='text-white text-sm pl-1'>{capitalizeFirstLetter(sortingMethod)}</p> */}
        </div>
    )
}