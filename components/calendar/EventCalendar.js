import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';

export default function EventCalendar({events, categories, dateClickCallback, taskClickCallback, taskDroppedCallback}) {

  const [eventSource, setEventSource] = useState(mapEvents)

  useEffect(() => {
    setEventSource(mapEvents)
  }, [events])

  function mapEvents(){
    const filteredEvents = events?.filter(event => event.dueDate !== '')
    const mappedEvents = filteredEvents.map(event => {
      const startTime = event.start !== '' && event.start !== null 
        ? new Date(event.start)
        : new Date(event.dueDate);
      const endTime = event.end !== '' && event.end !== null 
        ? new Date(event.end) 
        : null;
      const categoryColor = categories?.find(category => category.id === event.category)?.color || "#a39d9d";
      
      return {
        id: event.id,
        title: event.title,
        allDay: (event.start === '' || event.start === null) && (event.end === '' || event.end === null),
        start: startTime,
        end: endTime,
        color: categoryColor
      }
    });
    return mappedEvents;
  }

  return (
    <Calendar 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
      headerToolbar={{
        left:'today prev,next',
        center:'title',
        right:'dayGridMonth,timeGridWeek,timeGridDay'
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
      buttonText={{
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        prev: '<',
        next: '>',
      }}
      locale={'en-gb'}
      nowIndicator={true}
      height={'85%'}
    />
    );
}

