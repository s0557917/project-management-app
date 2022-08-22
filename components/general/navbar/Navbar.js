import Tabbing from "./Tabbing";
import { StatsRing } from "./StatsRing";
import UserMenu from "../authentication/UserMenu";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "../../../utils/db/settings";
import { useSession } from "next-auth/react";
import SearchBar from "./Searchbar";
import { getAllTasks } from "../../../utils/db/tasks";

export default function Navbar(){

    const { data: session, status } = useSession();
    const { data: userSettings, isLoading, isError } = useQuery(['settings'], getUserSettings);


    return(
        <div className="flex w-full justify-between bg-cyan-800">
            <UserMenu 
                userSettings={userSettings} 
                session={session}
            />
            <SearchBar />
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