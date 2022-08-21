import { Menu, NativeSelect } from "@mantine/core";
import { UserCircle } from "phosphor-react";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettings } from "../../../utils/db/settings";

export default function UserMenu ({ userSettings, session }) {
    const queryClient = useQueryClient();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [themePreference, setThemePreference] = useState('');
    const [defaultView, setDefaultView] = useState('');

    useEffect(() => {
        if (userSettings) {
            setThemePreference(userSettings.theme);
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

    useEffect(() => {
        console.log("THEME: ", themePreference, "DEFAULT VIEW: ", defaultView);
        const modifiedSettings = {...userSettings, theme: themePreference, defaultView: defaultView};
        console.log("Modified settings: " + JSON.stringify(modifiedSettings));
        userSettingsMutation.mutate(modifiedSettings);        

        // async function updateSettings() {
        //     await fetch(`/api/settings`, {
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(modifiedSettings),
        //     })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log("User settings updated: ", data);
        //         setUserSettings(data.settings);
        //     });
        //     setUpdateSettingsPending(false);
        // }

        // if(updateSettingsPending) {
        //     updateSettings();
        // }
    }, [themePreference, defaultView]);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function uncapitalizeFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }


    return (
        <Menu shadow="md" width={250}>
            <Menu.Target>
                <button className="mx-3" onClick={() => console.log("TEST")}>
                    <UserCircle size={60} color="2B2B2B" weight="fill" />
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
                    <p className="mr-10 text-xs">Theme</p>
                    <NativeSelect 
                        value={themePreference}
                        onChange={(event) => {
                            setThemePreference(uncapitalizeFirstLetter(event.target.value));
                            // setUpdateSettingsPending(true);
                        }}
                        data={[
                            { value: 'dark', label: 'Dark' },
                            { value: 'light', label: 'Light' }
                        ]}
                    />
                </div>
                <div className="flex mx-3 my-2 items-center">
                    <p className="mr-10 text-xs">Default View</p>
                    <NativeSelect 
                        value={defaultView}
                        onChange={(event) => {
                            setDefaultView(uncapitalizeFirstLetter(event.target.value));
                            // setUpdateSettingsPending(true);
                        }}
                        data={[
                            { value: 'task-list', label: 'Task List' },
                            { value: 'calendar', label: 'Calendar' },
                            { value: 'text-editor', label: 'Text Editor' }
                        ]}
                    />
                </div>        
            </Menu.Dropdown>
        </Menu>
    )
}