import React from 'react';
import CalendarScreen from './CalendarScreen';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/calendar/:month'>
          <CalendarScreen/>
        </Route>
        <Redirect to={{pathname: '/calendar/2023-01'}}/>
      </Switch>
     
    </Router>
  );
}

export default App;
