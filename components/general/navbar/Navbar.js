import Tabbing from "./Tabbing";
import { StatsRing } from "./StatsRing";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings, getTheme } from "../../../utils/db/queryFunctions/settings";
import SearchBar from "./Searchbar";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function Navbar(){

    // const { data: userSettings, isLoading, isError } = useQuery(['settings'], getUserSettings);

    return(
        <div className={`flex w-full justify-between ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
            <div className="flex items-center">
                <UserMenu 
                    // userSettings={userSettings}
                />
                <SearchBar />
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