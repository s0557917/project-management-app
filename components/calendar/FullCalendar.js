import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import styles from './Fullcalendar.module.scss';

export default function FullCalendar(props) {
    return (
       <Calendar {...props} plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    );
}