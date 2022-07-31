import ViewsTabs from "../components/general/ViewsTabs"
import FullCalendar from "../components/calendar/FullCalendar"

export default function Calendar() {
    return (
        <div>
            <ViewsTabs />
            <h1>Calendar</h1>

            <FullCalendar />
        </div>
    )
}