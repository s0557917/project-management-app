import { Check } from "phosphor-react";
import { Loader, Tooltip } from "@mantine/core";

export default function StatusInformation({status}) {
    return (
        <div className="flex flex-col items-end justify-end">
            {
                status === 'ready'
                    ? <Tooltip 
                        label="Editor is up to date!"       
                        color="green"
                        position="bottom"
                    >
                        <Check size={24} color="#16a34a" weight="fill" className="mt-2.5 mx-1 cursor-default"/>
                    </Tooltip>
                    : <Tooltip 
                        label="Processing changes!"
                        color="green"
                        position="bottom"
                    >
                        <div>
                            <Loader color="green" size="sm" className="mt-2.5 mx-1 cursor-default"/>
                        </div>
                    </Tooltip>
            }
        </div>
    )
}