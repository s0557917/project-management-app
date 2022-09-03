import getThemeColor from "../../../utils/color/getThemeColor";
import { useState, useEffect } from "react";
import Statistics from "./Statistics";
import SearchBar from "./Searchbar";
import UserMenu from "./UserMenu";
import Tabbing from "./Tabbing";

export default function StickyNavbar(){
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') { 
            if (window.scrollY > lastScrollY) { 
                setShow(false); 
            } else { 
                setShow(true);  
            }

            setLastScrollY(window.scrollY); 
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            globalThis.addEventListener('scroll', controlNavbar);
    
            return () => {
                globalThis.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    return(
        <>
            {show 
            && <div className={`absolute top-0 left-0 right-0 flex  justify-between ${getThemeColor('bg-gray-200', 'bg-zinc-800')}`}>
                    <div className="flex items-center">
                        <UserMenu />
                        <SearchBar />
                    </div>
                    <Tabbing />
                    <Statistics />
                </div>
            }
        </>
    )
}