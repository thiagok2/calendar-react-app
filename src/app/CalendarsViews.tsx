import { Box, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import {  ICalendar } from './backend';

interface ICalendarsViewProps  {
  calendars: ICalendar[], 
  toggledCalendar: (index:number) => void, 
  calendarsSelected: boolean[]
}
export default function CalendarsView(props:ICalendarsViewProps) {

  const { calendars, toggledCalendar, calendarsSelected } = props;
 
  return (  
    <Box marginTop={'64px'}>
      <h2>Agendas</h2>
      <FormGroup>
        {calendars.map((c, index) => 
          (<FormControlLabel key={c.id} 
                            control={<Checkbox checked={calendarsSelected[index]}
                            onChange={() => toggledCalendar(index)}
                            style={{color: c.color}}/> 
                            
                            } label={c.name} />))}
      </FormGroup>
    </Box>
  )
}