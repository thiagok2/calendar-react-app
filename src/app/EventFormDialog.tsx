import React, { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { createEventEndpoint, ICalendar, IEditingEvent, updateEventEndpoint, deleteEventEndpoint } from './backend';

const useStyles = makeStyles({
  formControl:{

  }
})

interface IEventDialogPros {
  event: IEditingEvent | null,
  onCancel: () => void,
  onSave: () => void,
  calendars: ICalendar[]
}

interface IValidationError{
  [field: string]: string 
}

export function EventFormDialog(props: IEventDialogPros) {
  const classes = useStyles();
  
  const [event, setEvent ] = useState<IEditingEvent | null>(props.event);
  const [errors, setErrors] = useState<IValidationError>({});

  const inputDate = useRef<HTMLInputElement | null >();
  const inputDesc = useRef<HTMLInputElement | null >();
  
  const isNew = !event?.id;
  
  useEffect(() => {
    setEvent(props.event);
    setErrors({});
  }, [props.event]);

  function validate(): boolean{
    if(event){
      const currentErrors: IValidationError = {}
      if(!event.date){
        currentErrors['date'] = 'Data não foi informada';
        inputDate.current?.focus();
      }    
      if(!event.desc){
        currentErrors['desc'] = 'Descrição não foi informada.';
        inputDesc.current?.focus();
      }
        
      if(!event.time)
        currentErrors['time'] = 'Hora não foi informada.';

      setErrors(currentErrors);
      return Object.keys(currentErrors).length  === 0;
    }
    setErrors({});
    return false;
  }

  function save(evt: React.FormEvent){
    evt.preventDefault();
    if(validate()){
      if(isNew)
        createEventEndpoint(event!).then(props.onSave)
      else
        updateEventEndpoint(event!).then(props.onSave)
      console.log('save')
    }
  }

  function deleteEvent(){
    if(event && !isNew)
      deleteEventEndpoint(event.id!).then(props.onSave);
  }

  return (
    <div>
      <Dialog open={!!event} onClose={props.onCancel} aria-labelledby="form-dialog-title">
        <form onSubmit={save}>
          <DialogTitle id="form-dialog-title">{isNew ? 'Novo evento': 'Atualizar evento'}</DialogTitle>
          <DialogContent>
            
            {event && (
              <>
                <TextField
                  autoFocus
                  margin="normal"
                  label="Descrição"
                  type="text"
                  fullWidth
                  value={event!.desc} onChange={(e) => setEvent({...event, desc: e.target.value})}
                  error={!!errors['desc']}
                  helperText={errors['desc']}
                  inputRef={inputDesc}
                />

                <TextField
                  margin="normal"
                  label="Data"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={event!.date}
                  onChange={(e) => setEvent({...event, date: e.target.value})}
                  error={!!errors['date']}
                  helperText={errors['date']}
                  inputRef={inputDate}
                />

                <TextField
                  margin="normal"
                  label="Hora"
                  type="time"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={event!.time}
                  onChange={(e) => setEvent({...event, time: e.target.value})}
                  error={!!errors['time']}
                  helperText={errors['time']}
                />

                <FormControl className={classes.formControl}  margin='normal' fullWidth>
                  <InputLabel htmlFor="select-calendar">Agenda</InputLabel>
                  <Select 
                    value={props.calendars[0].id}
                    inputProps={{
                      name: 'calendarId',
                      id: 'select-calendar',
                    }}
                    onChange={(e) => setEvent({...event, calendarId: e.target.value as number})}
                  >
                    {
                      props.calendars.map((calendar) => (
                        <MenuItem key={calendar.id} value={calendar.id}>{calendar.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
            </>
            )}
            
          </DialogContent>
          <DialogActions>
            {!isNew && 
              <Button color="primary" onClick={deleteEvent}>
                Excluir
              </Button>
            }
            <Box flex={1}></Box>
            <Button onClick={props.onCancel}>
              Cancelar
            </Button>
            <Button color="primary" type='submit'>
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
