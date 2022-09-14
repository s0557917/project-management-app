import { useState } from 'react';
import { Modal } from '@mantine/core';
import { Info } from 'phosphor-react';
import { ScrollArea } from '@mantine/core';
import getThemeColor from '../../../utils/color/getThemeColor';

export default function UsageInformation() {
    const [opened, setOpened] = useState(false);
    
    const backgroundColor = getThemeColor('bg-gray-200', 'bg-zinc-800');

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="How do I use this editor?"
                size="60%"
            >
                <ScrollArea
                    className='my-1 '
                    style={{ height: 400, width: '100%' }}
                >
                    <p className='py-2 px-3'>
                        This editor allows you to work with your tasks through text, enabling you to quickly add, eddit and delete tasks. All changes performed here will be translated into all other views.
                    </p>
                    <ul className='list-disc m-2'>
                        <li className={`${backgroundColor} rounded-md py-2 px-3`}> There are different tags which represent different sections of a task and allow you to add or modify your tasks according to what you need.
                            <ul className='list-disc pl-10 mt-1'>
                                <li><span className='font-bold text-md'>t\ </span>- The task's title</li>
                                <li><span className='font-bold text-md'>d\ </span>- The task's details</li>
                                <li><span className='font-bold text-md'>c\ </span>- The task's category</li>
                                <li><span className='font-bold text-md'>p\ </span>- The task's priority. This has to be a value between 1 to 5.</li>
                                <li><span className='font-bold text-md'>dt\</span>- The task's date and time. It is important to watch the spacing very closely and the date has to be formatted as:
                                    <uL className='list-disc pl-10 mt-1'>
                                        <li><span className='font-bold text-md'>DD-MM-YYYY</span> - A simple due date</li>
                                        <li><span className='font-bold text-md'>DD-MM-YYYY HH:MM-HH:MM</span> - A due date with a start and end time.</li>
                                    </uL>
                                </li>
                            </ul>
                        </li>
                        <li className={`${backgroundColor} rounded-md py-2 px-3 mt-3`}>These tags some specific rules that need to be followed in order for them to properly work:
                            <ul className='list-disc pl-10 mt-1'>
                                <li>There can't be any empty lines</li>
                                <li>All lines have to have at least a title tag, all other components are optional.</li>
                                <li>A line can only have a single of each component, meaning that a line can not have, for example, multiple title or priority tags.</li>
                                <li>All tags have to have some content. If you don't wish to use a tag, remove it completely!</li>
                            </ul>
                        </li>
                        <li className={`${backgroundColor} rounded-md py-2 px-3 mt-3`}>
                            Now that the basics are hopefully clear, you can use this to add, edit or delete your tasks. 
                            <ul className='list-disc pl-10 mt-1'>
                                <li>In order to delete a task, simply remove the whole line without leaving an empty line, and the task will also be deleted.</li>
                                <li>In order to add a task, simply add a new line with the tags you wish to use. Remember that you have to at least include a title!</li>
                                <li>In order to edit a task, simply modify the components you wish to change. Remember to ensure that they are all valid!</li>
                            </ul>
                        </li>
                        <li className={`${backgroundColor} rounded-md py-2 px-3 mt-3`}>The editor offers an auto-complete functionality to help you ensure that you are using the tags correctly. You can access it by: 
                            <ul className='list-disc pl-10 mt-1'>
                                <li>Simply typing \ anywhere </li>  
                                <li>While typing valid tags, relevant suggestions will also be shown to you.</li>
                            </ul>
                            Then, move around the suggestions using the arrow keys and press enter to select the suggestion.
                        </li>
                    </ul>
                </ScrollArea>
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