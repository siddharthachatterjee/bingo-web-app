import React, { useContext } from 'react';
import { Switch, Route } from "react-router-dom";
//import Player from "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/static/scripts/Player.js";
import './App.css';
import { Context } from './Context';
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
import New from './pages/new/New';


function App() {
  const {loaded} = useContext(Context);
  return (
    <>
    {loaded && <Switch>
      <Route exact path = "/">
        <Home />
      </Route>
      <Route path = "/new">
        <New />
      </Route>
      <Route path = "/auth">
        <Auth />
      </Route>
    </Switch>}
    </>
  );
}

export default App;
