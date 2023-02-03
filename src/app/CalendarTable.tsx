import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Icon from "@material-ui/core/Icon";
import { DAYS_OF_WEEK, ICalendarCell } from './helpers/CalendarHelper';
import React from 'react';
import { IEvent } from './backend';

const useStyles = makeStyles({
  root: {
    height: '100%',
    flex: 1
  },
  table: {
    borderTop: '1px solid rgb(224, 224, 224)',
    minHeight: '100%',
    tableLayout:'fixed',
    "& td ~ td, & th ~ th":{
      borderLeft: '1px solid rgb(224, 224, 224)'
    },
    "& td": {
      verticalAlign: 'top',
      overflow: 'hidden',
      padding: '8px 4px'
    }
  },
  dayOfMonth: {
    fontWeight: 500,
    marginBottom: '4px',
    // width: "40px",
    // lineHeight: "24px",
     
    // borderRadius: "50%",
    // "&.today": {
    //   backgroundColor: "#3f51b5",
    //   color: "white",
    // },
  },
  event:{
    display:'flex',
    alignItems:'center',
    background: 'none',
    border:'none', 
    cursor: 'pointer',
    textAlign:'left',
    whiteSpace:'nowrap',
    margin: '4px 0px'
  },
  eventBackground:{
    color: 'white',
    padding: '4px 4px',
    borderRadius: '5px'
  }
});

interface CalendarTableProps {
  weeks: ICalendarCell[][],
  onClickDay: (date: string) => void,
  onClickEvent: (evt: IEvent) => void
}

export default function CalendarTable(props:CalendarTableProps) {
  const { weeks, onClickDay, onClickEvent} = props;
  const classes = useStyles()
  
  function handleClick(evt: React.MouseEvent, date: string){
    if(evt.target === evt.currentTarget){
      onClickDay(date);
    }
  };

  function handleClickEvent(evt: React.MouseEvent, event: IEvent){
    onClickEvent(event)
  }

  return (
    <TableContainer component={'div'} className={classes.root}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {DAYS_OF_WEEK.map((day) => (
              <TableCell align="center" key={day}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {
          weeks.map((week, i) => 
            <TableRow key={i}>
              {week.map((cellDay) => (
                <TableCell key={cellDay.date} align="center" onClick={(evt) => handleClick(evt, cellDay.date)}>
                  <div className={classes.dayOfMonth}>
                      {cellDay.dayOfMonth}

                      {cellDay.events.map(event => {
                        const color = event.calendar?.color;
                        return (
                          <button className={classes.event} key={event.id} onClick={(evt) => handleClickEvent(evt, event)}>
                            {event.time && 
                              <>
                                <Icon style={{color}} fontSize='inherit'>watch_later</Icon>
                                <span style={{margin: '0px 4px'}}> {event.time} </span>
                              </>
                              }
                            {event.time ? 
                              <span>{event.desc}</span> : 
                              <div className={classes.eventBackground} style={{backgroundColor:color}}>{event.desc}</div>}
                        </button>
                        )
                      }
                        
                      )}
                  </div>
                </TableCell>
              ))}

            </TableRow> 
          )
        }
        </TableBody>
      </Table>
    </TableContainer>
  )
}