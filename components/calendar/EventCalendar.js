import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';

export default function EventCalendar({events, dateClickCallback, eventClickCallback}) {

  const [eventSource, setEventSource] = useState(mapEvents)

  // useEffect(() => {
  //   setEventSource(mapEvents)
  // }, [events])

  function mapEvents(){
    const filteredEvents = events?.filter(event => event.dueDate !== '')
    const mappedEvents = filteredEvents.map(event => {
      if(event.timeRange.length > 0){
        const startTime = new Date(event.timeRange[0]).toISOString();
        const endTime = new Date(event.timeRange[1]).toISOString();

        return {
          title: event.title,
          start: startTime,
          end: endTime
        }
      } else {
        return {
          title: event.title,
          start: invertDate(event.dueDate)
        }
      }
    })

    return mappedEvents;
  }
  
  function invertDate(str){
    return str.split('-').reverse().join('-');
 }

  return (
      <Calendar 
        eventClick={(arg) => console.log("CLICKED Event")}
        dateClick={(arg) => dateClickCallback(arg)}
        plugins={[dayGridPlugin, interactionPlugin]} 
        initialView="dayGridMonth" 
        events={eventSource}
        eventTimeFormat={
          {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
          }
        }
      />
    );
}

