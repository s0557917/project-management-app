import dayjs from 'dayjs';
import { useState } from 'react';
import { Divider } from '@mantine/core'
import { Calendar, TimeRangeInput } from '@mantine/dates'
import Dialogue from '../general/dialogues/Dialogue';

export default function DateTimePickerDialogue({ dateTimeDialogState, dateTimePickerCallback, dueDate, startPoint, endPoint, userTimezoneState }) {
    const now = new Date();
    const then = dayjs(now).add(60, 'minutes').toDate();
    const [dateTimePickerOpened, setDateTimePickerOpened] = dateTimeDialogState;
    const [userTimezone, setUserTimezone] = useState(null);
    
    const [isTimeRangeDisplayed, setIsTimeRangeDisplayed] = useState(false);

    const [timeRange, setTimeRange] = useState(startPoint && endPoint ? [new Date(startPoint), new Date(endPoint)] : [now, then]);
    const [pickedDate, setPickedDate] = useState(dueDate ? new Date(dueDate) : now);

    function formatDateTime(){

        let start = null;
        let end = null;

        if(isTimeRangeDisplayed || startPoint && endPoint) {
            start = new Date(pickedDate.getTime());
            start.setHours(timeRange[0].getHours());
            start.setMinutes(timeRange[0].getMinutes());
            start.setSeconds(timeRange[0].getSeconds());

            end = new Date(pickedDate.getTime());
            end.setHours(timeRange[1].getHours());
            end.setMinutes(timeRange[1].getMinutes());
            end.setSeconds(timeRange[1].getSeconds());
    
            if(end.getHours() < start.getHours()){
                end = dayjs(end).add(1, 'day').toDate();
            }
        }
        setTimeRange([start, end]);
        dateTimePickerCallback(start === null ? pickedDate : start, start, end, userTimezone);
    }

    return (
        <Dialogue 
            opened={dateTimePickerOpened}
            onClose={() => setDateTimePickerOpened(false)}
            title="Set a date and time"
            saveButtonCallback={() => formatDateTime()}
        >
            <>
                <Calendar 
                    value={pickedDate} 
                    initialMonth={pickedDate}
                    onChange={(value) => setPickedDate(value)} 
                    fullWidth={true}
                />
                <Divider my="sm" />
                {isTimeRangeDisplayed || (startPoint && endPoint)
                    ? <TimeRangeInput
                    value={timeRange}
                    onChange={(value) => {
                        setTimeRange(value);
                        setUserTimezone((new Date()).getTimezoneOffset());
                    }}
                    label="Duration"
                    clearable
                    />
                    : <div className='w-full'>
                        <p className='text-sm'>Duration: </p>
                        <button className='text-xl block mx-auto hover:bg-blue-700 bg-cyan-500 text-white rounded-full w-8 h-8' onClick={() => setIsTimeRangeDisplayed(true)}>
                            +
                        </button>

                    </div>
                }
                <Divider my="sm" />
            </>
        </Dialogue>
    )
}