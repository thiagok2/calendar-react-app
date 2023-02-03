
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';

import { Avatar, Box, IconButton } from '@material-ui/core';
import { Link, } from 'react-router-dom';
import { addMonths, formatMonth } from './helpers/dateFunctions';


type CalendarHeaderProps = {
  month: string
}

export default function CalendarHeader(props:CalendarHeaderProps) {
  const { month } = props;

  return (
        <Box display='flex' flexDirection='row'>
          <Box>
            <IconButton aria-label="Mês anterior"
              component={Link}
              to={"/calendar/" + addMonths(month, -1)}>
              <ChevronLeftIcon></ChevronLeftIcon>
            </IconButton>
            <IconButton  aria-label="Próximo mês"
              component={Link}
              to={"/calendar/" + addMonths(month, 1)}>
              <ChevronRightIcon></ChevronRightIcon>
            </IconButton>
          </Box>
          <Box component={'strong'} style={{flex: 1, display:'flex', alignItems:'center', paddingLeft: 10}}>
            {formatMonth(month)}
          </Box>
          <IconButton>
            <Avatar>
              <PersonIcon></PersonIcon>
            </Avatar>
          </IconButton>
        </Box>
  )
}