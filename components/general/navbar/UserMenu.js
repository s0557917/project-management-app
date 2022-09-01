import { Menu } from "@mantine/core";
import { UserCircle } from "phosphor-react";
import UserInformation from "./user-menu/UserInformation";
import ThemeInformation from "./user-menu/ThemeInformation";
import DefaultViewInformation from "./user-menu/DefaultViewInformation";
import SignOutButton from "./user-menu/SignOutButton";

export default function UserMenu () {
    return (
        <div className="flex items-center justify-center">
            <Menu shadow="md" width={250}>
                <Menu.Target>
                    <button className="mx-3 hover:scale-105 transition-all active:scale-95">
                        <UserCircle size={50} color="#15803d" weight="fill" />
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <UserInformation />
                    <ThemeInformation />
                    <DefaultViewInformation />     
                    <Menu.Divider />
                    <SignOutButton />
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}