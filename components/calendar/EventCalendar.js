import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';

export default function EventCalendar({events, dateClickCallback, taskClickCallback, taskDroppedCallback}) {

  const [eventSource, setEventSource] = useState(mapEvents)

  useEffect(() => {
    setEventSource(mapEvents)
  }, [events])

  function mapEvents(){
    const filteredEvents = events?.filter(event => event.dueDate !== '')
    const mappedEvents = filteredEvents.map(event => {
      const startTime = event.start !== '' ? new Date(event.start): new Date(event.dueDate);
      const endTime = event.end !== '' ? new Date(event.end) : null;
      return {
        id: event.id,
        title: event.title,
        allDay: event.start === '' && event.end === '',
        start: startTime,
        end: endTime,
      }
    });
    console.log("MAPPED: ", mappedEvents)
    return mappedEvents;
  }

  return (
    <Calendar 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
      headerToolbar={{
        left:'title',
        center:'',
        right:'today prev,next dayGridMonth,timeGridWeek,timeGridDay'
      }}
      eventClick={(arg) => taskClickCallback(events.find((event) => event.id === arg.event.id))}
      dateClick={(arg) => dateClickCallback(arg.date)}
      initialView="dayGridMonth" 
      events={eventSource}
      eventTimeFormat={
        {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
        }
      }
      editable={true}
      eventDrop={(args) => taskDroppedCallback(args.event)}
    />
    );
}

