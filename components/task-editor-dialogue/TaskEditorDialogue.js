import { useState } from 'react';
import { Modal, Group, TextInput } from '@mantine/core';


export default function TaskEditorDialogue() {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Modal centered
                opened={opened}
                onClose={() => setOpened(false)}
                title="Introduce yourself!"
            >
                <h1>Hey Hey!</h1>
                <TextInput
                    placeholder="Your name"
                    label="Full name"
                    required
                />
            </Modal>

            <Group position="center">
                <button class="bg-cyan-500 mb-3 my-3 p-3 text-white" onClick={() => setOpened(true)}>Open modal</button>
            </Group>
        </>
    );

}