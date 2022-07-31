import dayjs from 'dayjs';
import { useState } from 'react';
import { Divider, Modal } from '@mantine/core'
import { Calendar, TimeRangeInput } from '@mantine/dates'
import Dialogue from '../general/dialogues/Dialogue';

export default function DateTimePickerDialogue({ dateTimePickerState, dateTimePickerCallback }) {
    const now = new Date();
    const then = dayjs(now).add(30, 'minutes').toDate();
    const [dateTimePickerOpened, setDateTimePickerOpened] = dateTimePickerState;
    const [pickedDate, setPickedDate] = useState(null);
    const [pickedTimeRange, setPickedTimeRange] = useState([now, then]); 

    return (
        <Dialogue 
            opened={dateTimePickerOpened}
            onClose={() => setDateTimePickerOpened(false)}
            title="Set a date and time"
            saveButtonCallback={() => dateTimePickerCallback(pickedDate, pickedTimeRange)}
        >
            <>
                <Calendar value={pickedDate} onChange={setPickedDate} />
                <Divider my="sm" />
                <TimeRangeInput
                    value={pickedTimeRange}
                    onChange={setPickedTimeRange}
                    label="Duration"
                    clearable
                />
            </>
        </Dialogue>
    )
}