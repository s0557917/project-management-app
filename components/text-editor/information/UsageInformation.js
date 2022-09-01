import { useState } from 'react';
import { Modal } from '@mantine/core';
import { Info } from 'phosphor-react';

export default function UsageInformation() {
    const [opened, setOpened] = useState(false);
    
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Introduce yourself!"
            >
                <ul>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                    <li>This is going to be filled with some information on how to use this editor.</li>
                </ul>
            </Modal>
            <button 
                className='justify-self-end hover:scale-105 active:scale-95 cursor-pointer pt-2.5'
                onClick={() => setOpened(true)}
            >
                <Info size={32} color="#16a34a" weight='fill'/>
            </button>
        </>
    )
}