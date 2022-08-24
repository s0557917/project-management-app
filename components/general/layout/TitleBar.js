import SortingMenu from "../menus/filtering-and-sorting/SortingMenu";
import FilteringMenu from "../menus/filtering-and-sorting/FilteringMenu";
import getThemeColor from "../../../utils/color/getThemeColor";

export default function TitleBar({ displaySortingMenu }) {
    return (
        <div className="mx-auto flex items-center justify-between w-4/5">
            <h1 className={`${getThemeColor('text-gray-900', 'text-white')} text-2xl font-bold`}>Tasks</h1>
            <div className="flex items-center">
                {
                    displaySortingMenu 
                    && <div className="px-2">
                        <SortingMenu />
                    </div>
                }
                <div className="px-2">
                    <FilteringMenu />
                </div>
            </div>
        </div>
    );
}