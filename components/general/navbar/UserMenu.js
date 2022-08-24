import { Menu } from "@mantine/core";
import { UserCircle } from "phosphor-react";

import UserInformation from "./user-menu/UserInformation";
import ThemeInformation from "./user-menu/ThemeInformation";
import DefaultViewInformation from "./user-menu/DefaultViewInformation";

export default function UserMenu () {
    return (
        <div className="flex items-center justify-center">
            <Menu shadow="md" width={250}>
                <Menu.Target>
                    <button className="mx-3 hover:scale-105 transition-all active:scale-95" onClick={() => console.log("TEST")}>
                        <UserCircle size={44} color="#16a34a" weight="fill" />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <UserInformation />
                    <ThemeInformation />
                    <DefaultViewInformation />     
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}