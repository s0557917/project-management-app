import getThemeColor from "../../../utils/color/getThemeColor";
import Statistics from "./Statistics";
import UserMenu from "./UserMenu";
import Tabbing from "./Tabbing";
import SearchBar from "./SearchBar";

export default function Navbar(){

    return(
        <div className={`flex w-full h-14 justify-between ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
                <div className="flex items-center">
                    <UserMenu />
                    <SearchBar />
                </div>
                <Tabbing />
                <Statistics />
        </div>
    )
}