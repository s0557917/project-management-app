import Tabbing from "./Tabbing";
import { StatsRing } from "./StatsRing";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "../../../utils/db/queryFunctions/settings";
import { useSession } from "next-auth/react";
import SearchBar from "./Searchbar";
import { getAllTasks } from "../../../utils/db/queryFunctions/tasks";

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