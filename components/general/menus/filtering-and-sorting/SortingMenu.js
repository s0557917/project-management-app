import { Menu } from '@mantine/core'
import { FunnelSimple, Calendar, Tag, GitFork } from 'phosphor-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateSorting } from '../../../../utils/db/queryFunctions/settings'
import { getSorting } from '../../../../utils/db/queryFunctions/settings'
import getThemeColor from '../../../../utils/color/getThemeColor'

export default function SortingMenu () {
    const queryClient = useQueryClient()
    const {data: sortingLogic} = useQuery(['sorting'], getSorting);
    const updateSortingMutation = useMutation(
        (updatedSorting) => updateSorting(updatedSorting),
        {onSuccess: async () => {
            queryClient.invalidateQueries('sorting')
        }}
    )

    const inactiveColor = getThemeColor('text-gray-900', 'text-white');
    const activeColor = '#16a34a';

    return (
        <div className='flex items-center'>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <button className='hover:scale-110 active:scale-90 transition-all'>
                        <FunnelSimple size={28} color="#16a34a" /> 
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Sort by:</Menu.Label>
                    <Menu.Item 
                        icon={<Calendar size={18} />}
                        onClick={() => updateSortingMutation.mutate('date')} 
                        color={sortingLogic === 'date' ? activeColor : inactiveColor}
                    >
                        Date
                    </Menu.Item>
                    <Menu.Item 
                        icon={<Tag size={18} weight="fill" />}
                        onClick={() => updateSortingMutation.mutate('category')} 
                        color={sortingLogic === 'category' ? activeColor : inactiveColor}
                    >
                        Category
                    </Menu.Item>
                    <Menu.Item 
                        icon={<p className='text-lg font-bold'>P</p>}
                        onClick={() => updateSortingMutation.mutate('priority')} 
                        color={sortingLogic === 'priority' ? activeColor : inactiveColor}
                    >
                        Priority
                    </Menu.Item>
                    <Menu.Item 
                        icon={<GitFork size={18} weight="fill" className='rotate-180'/>}
                        onClick={() => updateSortingMutation.mutate('subtasks')} 
                        color={sortingLogic === 'subtasks' ? activeColor : inactiveColor}
                    >
                        Subtasks
                    </Menu.Item>

                </Menu.Dropdown>
            </Menu>
            {/* <p className='text-white text-sm pl-1'>{capitalizeFirstLetter(sortingMethod)}</p> */}
        </div>
    )
}