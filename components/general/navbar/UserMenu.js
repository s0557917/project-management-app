import { Menu, NativeSelect, useMantineColorScheme } from "@mantine/core";
import { UserCircle } from "phosphor-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettings, updateTheme } from "../../../utils/db/queryFunctions/settings";
import { uncapitalizeFirstLetter } from "../../../utils/text/textFormatting";
import ThemeSwitcher from "../buttons/ThemeSwitcher";
import { getTheme } from "../../../utils/db/queryFunctions/settings";

export default function UserMenu ({ userSettings, session }) {
    const queryClient = useQueryClient();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [defaultView, setDefaultView] = useState('');

    const { data: theme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 

    const { toggleColorScheme } = useMantineColorScheme();

    useEffect(() => {
        toggleColorScheme(theme);
    }, [isFetchingTheme])

    useEffect(() => {
        if (userSettings) {
            setDefaultView(userSettings.defaultView);
        }

        if(session) {
            setUserName(session.user.name);
            setUserEmail(session.user.email);
        }
    }, [userSettings, session])

    const userSettingsMutation = useMutation(
        (updatedUserSettings) => updateUserSettings(updatedUserSettings),
        {onSuccess: async () => {
            queryClient.invalidateQueries('settings');
        }}
    );

    const updateThemeMutation = useMutation(
        (updatedTheme) => updateTheme(updatedTheme),
        {onSuccess: async () => {
            queryClient.invalidateQueries('theme');
        }}
    )

    useEffect(() => {
        if(defaultView != '' && userSettings.filters.length > 0) {
            const modifiedSettings = {...userSettings, theme: theme, defaultView: defaultView};
            userSettingsMutation.mutate(modifiedSettings);    
        }
    }, [defaultView]);

    return (
        <div className="flex items-center justify-center">
            <Menu shadow="md" width={250}>
                <Menu.Target>
                    <button className="mx-3 hover:scale-105 transition-all active:scale-95" onClick={() => console.log("TEST")}>
                        <UserCircle size={44} color="#16a34a" weight="fill" />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>
                        <div className="flex">
                            Username: 
                            <p className="mx-1 font-semibold text-md">{userName}</p>
                        </div>
                    </Menu.Item>
                    <Menu.Item>
                        <div className="flex">
                            Email: 
                            <p className="mx-1 font-semibold">{userEmail}</p>
                        </div>
                    </Menu.Item>
                    <div className="flex mx-3 my-2 items-center">
                        <p className="text-xs w-2/4">Theme</p>
                        <div className="w-2/4">
                            <ThemeSwitcher 
                                theme={theme}
                                updateThemeMutation={updateThemeMutation}
                            />
                        </div>
                    </div>
                    <div className="flex mx-3 my-2 items-center">
                        <p className="text-xs w-2/4">Default View</p>
                        <div className="ml-5 w-2/4">
                            <NativeSelect 
                                value={defaultView}
                                onChange={(event) => {
                                    setDefaultView(uncapitalizeFirstLetter(event.target.value));
                                    onInputChange();
                                }}
                                data={[
                                    { value: 'task-list', label: 'Task List' },
                                    { value: 'calendar', label: 'Calendar' },
                                    { value: 'text-editor', label: 'Text Editor' }
                                ]}
                            />
                        </div>
                    </div>        
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}