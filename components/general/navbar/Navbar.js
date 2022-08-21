import Tabbing from "./Tabbing";
import { TextInput } from '@mantine/core';
import { MagnifyingGlass, User } from "phosphor-react";
import { StatsRing } from "./StatsRing";
import UserMenu from "../authentication/UserMenu";

export default function Navbar(){
    return(
        <div className="flex w-full justify-between bg-cyan-800">
            <UserMenu />
            <div className="self-center m-3 w-72">
                <TextInput 
                    placeholder={"Search..."}
                    icon={<MagnifyingGlass size={16} />}
                />
            </div>
            <Tabbing />
            <div className="self-center">
                <StatsRing
                        data={{
                        "label": "Tracked Tasks",
                        "stats": "88",
                        "progress": 76,
                        "color": "green",
                        "icon": "up"
                    }}
                />
            </div>
        </div>
    )
}