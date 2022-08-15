import Tabbing from "./Tabbing";
import { TextInput } from '@mantine/core';
import { MagnifyingGlass } from "phosphor-react";
import { StatsRing } from "./StatsRing";

export default function Navbar(){
    return(
        <div className="flex items-end w-screen bg-cyan-800">
            <TextInput 
                placeholder={"Search..."}
                icon={<MagnifyingGlass size={16} />}
            />
            <Tabbing />
            <StatsRing
                 data={
                    [
                        { "label": "Page views", "stats": "456,578", "progress": 65, "color": "teal", "icon": "up" },
                        { "label": "New users", "stats": "2,550", "progress": 72, "color": "blue", "icon": "up" },
                        {
                          "label": "Orders",
                          "stats": "4,735",
                          "progress": 52,
                          "color": "red",
                          "icon": "down"
                        }
                      ]
                 }
            />
        </div>
    )
}