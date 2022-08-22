import { TextInput, Menu } from '@mantine/core';
import { MagnifyingGlass } from "phosphor-react";
import useDebounce from '../../../utils/hooks/useDebounce';
import { getSearchResults } from '../../../utils/db/search.js';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function SearchBar() {

    const [searchValue, setSearchValue] = useState('');
    const debounedSearchValue = useDebounce(searchValue, 300);
    const { data: searchResults } = useQuery(
        ['tasks', searchValue], 
        getSearchResults(debounedSearchValue),
        {
            enabled: debounedSearchValue.length > 0
        }
    );

    return (
        <div className="self-center m-3 w-72">
            <TextInput 
                placeholder={"Search..."}
                icon={<MagnifyingGlass size={16} />}
            />

            {/* <Menu
                width={275}
                opened={true}
            >
                <Menu.Target>
                    <TextInput 
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                        placeholder={"Search..."}
                        icon={<MagnifyingGlass size={16} />}
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <ul>
                        {searchResults?.map(result => <p key={result.id}>{result.title}</p>)}
                    </ul>
                </Menu.Dropdown>
            </Menu> */}
        </div>
    )
}