import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
// import styles from './Fullcalendar.module.scss';

export default function EventCalendar({dateClickCallback, eventClickCallback}) {
    return (
      <Calendar 
        eventClick={(arg) => console.log("CLICKED Event")}
        dateClick={(arg) => dateClickCallback(arg)}
        plugins={[dayGridPlugin, interactionPlugin]} 
        initialView="dayGridMonth" 
        events={[
          {
            title: 'All Day Event',
            start: '2022-08-01'
          },
          {
            title: 'Long Event',
            start: '2022-08-07',
            end: '2022-08-10'
          },
          {
            groupId: '999',
            title: 'Repeating Event',
            start: '2022-08-09T16:00:00'
          },
          // {
          //   groupId: '999',
          //   title: 'Repeating Event',
          //   start: '2022-08-16T16:00:00',
          //   end: '2022-08-18T16:00:00'
          // },
          // {
          //   title: 'Conference',
          //   start: '2022-08-11',
          //   end: '2022-08-13'
          // },
          // {
          //   title: 'Meeting',
          //   start: '2022-08-12T10:30:00',
          //   end: '2022-08-12T12:30:00'
          // },
          // {
          //   title: 'Lunch',
          //   start: '2022-08-12T12:00:00',
          //   end: '2022-08-12T14:00:00'
          // },
          // {
          //   title: 'Meeting',
          //   start: '2022-08-12T14:30:00',
          //   end: '2022-10-12T18:30:00',
          //   color: '#ff0000',
          //   editable: true
          // },
          // {
          //   title: 'Birthday Party',
          //   start: '2022-08-13T07:00:00'
          // },
          // {
          //   title: 'Click for Google',
          //   url: 'http://google.com/',
          //   start: '2022-08-28'
          // }
        ]}
      />
    );
}