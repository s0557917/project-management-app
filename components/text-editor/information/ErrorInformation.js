import { useDisclosure } from '@mantine/hooks';
import { Warning } from "phosphor-react";
import { Popover } from "@mantine/core";

export default function ErrorInformation({errors}) {
    const [opened, { close, open }] = useDisclosure(false);
    return (
        <Popover 
            width={300} 
            position="bottom" 
            shadow="xl" 
            opened={opened}
            withArrow={false}
        >
            <Popover.Target>
                <Warning
                    onMouseEnter={open} 
                    onMouseLeave={close}
                    size={20} 
                    color="#d12929" 
                    weight="fill" 
                    className="mt-2.5 mx-2 cursor-pointer"
                />
            </Popover.Target>
            <Popover.Dropdown className='bg-red-100'  sx={{ pointerEvents: 'none' }}>
                <ul className=' flex flex-col items-center justify-center'>
                {errors?.map(error => 
                    <li 
                        className="text-red-600 text-xs"><span className="font-bold"
                        key={`error-${error}`}
                    >Error:
                        </span> {error}
                    </li>)}
                </ul>
            </Popover.Dropdown>
        </Popover>
    )
}