import { Box, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { generateCalendar } from './helpers/CalendarHelper';
import { getCalendarsEndpoint, getEventsEndpoint, ICalendar, IEditingEvent, IEvent } from './backend';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsViews';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './helpers/dateFunctions';

type CalendarScreenProps = {

}

export default function CalendarScreen(props:CalendarScreenProps) {

  const params = useParams<{month: string}>();

  const month = params.month;

  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] =useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelecteds] = useState<boolean[]>([true, true]);

  const [editingEvent, setEditingEventEdit] = useState<IEditingEvent | null>(null);

  const weeks = generateCalendar(month, events, calendars, calendarsSelected);
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length-1][6].date;

  function toggledCalendar(index:number){
    const newValue = [...calendarsSelected];
    newValue[index] = !newValue[index]
    setCalendarsSelecteds(newValue);
  }

  function closeDialog(){
    setEditingEventEdit(null);
  }

  function refresh(){
    setEditingEventEdit(null);
    getEventsEndpoint(firstDate, lastDate).then(setEvents);
    
  }
  
  useEffect( () => {
    Promise.all([
      getCalendarsEndpoint(), 
      getEventsEndpoint(firstDate, lastDate)
    ]).then(([calendars, events]) => {
      setCalendars(calendars);
      setCalendarsSelecteds(calendars.map(c => true));
      setEvents(events);
    })
    
  },[firstDate, lastDate]);

  function openNewEvent(date:string){
    setEditingEventEdit({date, desc: '', calendarId: calendars[0].id})
  }
  function onClickDay(date: string){
    openNewEvent(date);
  }

  function onClickEvent(event: IEvent){
    setEditingEventEdit(event);
  }


  return (
    <Box display={'flex'} height='100%' alignItems='stretch'>
      <Box borderRight={'1px solid #ccc'} width='16em' padding='8px 16px'>
        <h1>Agenda dos Profs</h1>
        <Button variant="contained" color='primary' onClick={() => openNewEvent(getToday())}>Novo evento</Button>
        <CalendarsView calendars={calendars} toggledCalendar={toggledCalendar} calendarsSelected={calendarsSelected}/>
      </Box>
      <Box width={'100%'}>
        <CalendarHeader month={month}/>
        <EventFormDialog 
           event={editingEvent}
           onCancel={closeDialog}
           onSave={() => {
             refresh()
           }}
           calendars={calendars}/>
        <CalendarTable weeks={weeks} onClickDay={onClickDay} onClickEvent={onClickEvent}/>
      </Box>
    </Box>

  )
}