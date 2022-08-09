import dayjs from 'dayjs';
import { useState } from 'react';
import { Divider } from '@mantine/core'
import { Calendar, TimeRangeInput } from '@mantine/dates'
import Dialogue from '../general/dialogues/Dialogue';

export default function DateTimePickerDialogue({ dateTimeDialogState, dateTimePickerCallback, dateState, timeRangeState, userTimezoneState }) {
    const now = new Date();
    const then = dayjs(now).add(60, 'minutes').toDate();
    const [dateTimePickerOpened, setDateTimePickerOpened] = dateTimeDialogState;
    const [pickedDate, setPickedDate] = useState(dateState ? new Date(dateState) : now );
    const [pickedTimeRange, setPickedTimeRange] = useState(
        timeRangeState.length > 0 
            ? [new Date(timeRangeState[0]), new Date(timeRangeState[1])] 
            : [now, then] 
    ); 
    const [userTimezone, setUserTimezone] = useState(null);

    return (
        <Dialogue 
            opened={dateTimePickerOpened}
            onClose={() => setDateTimePickerOpened(false)}
            title="Set a date and time"
            saveButtonCallback={() => dateTimePickerCallback(pickedDate, pickedTimeRange, userTimezone)}
        >
            <>
                <Calendar 
                    value={pickedDate} 
                    initialMonth={pickedDate}
                    onChange={setPickedDate} 
                    fullWidth={true}
                />
                <Divider my="sm" />
                <TimeRangeInput
                    value={pickedTimeRange}
                    onChange={() => {
                        setPickedTimeRange(pickedTimeRange);
                        setUserTimezone((new Date()).getTimezoneOffset());
                    }}
                    label="Duration"
                    clearable
                />
            </>
        </Dialogue>
    )
}