import { Menu, NativeSelect } from "@mantine/core";
import { UserCircle } from "phosphor-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserMenu () {

    const { data: session, status } = useSession();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [themePreference, setThemePreference] = useState('');
    const [defaultView, setDefaultView] = useState('');
    const [userSettings, setUserSettings] = useState({});
    const [updateSettingsPending, setUpdateSettingsPending] = useState(false);

    useEffect(() => {
        setUserName(session?.user.name);
        setUserEmail(session?.user.email);

        async function getUser() {
            await fetch(`/api/settings`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(),
            })
            .then((response) => response.json())
            .then((data) => {
                setUserSettings(data);
                setThemePreference(capitalizeFirstLetter(data.theme));
                setDefaultView(capitalizeFirstLetter(data.defaultView));
            });
        }

        if(userSettings 
            && Object.keys(userSettings).length === 0
            && Object.getPrototypeOf(userSettings) === Object.prototype
        ) {
            getUser();
        }
    }, []);

    useEffect(() => {
        const modifiedSettings = {...userSettings, theme: themePreference, defaultView: defaultView};
        
        async function updateSettings() {
            await fetch(`/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(modifiedSettings),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("User settings updated: ", data);
                setUserSettings(data.settings);
            });
            setUpdateSettingsPending(false);
        }

        if(updateSettingsPending) {
            updateSettings();
        }
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
                            setUpdateSettingsPending(true);
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
                            setUpdateSettingsPending(true);
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