/* Siddhartha Chatterjee
 * __________________
 * @Copyright Siddhartha Chatterjee
 *  [2020] - [2025] Siddhartha Chatterjee
 *  All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains
 * the property of Siddhartha Chatterjee,
 * The intellectual and technical concepts contained
 * herein are proprietary to Siddhartha Chatterjee
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Siddhartha Chatterjee.
 */
import React, { useContext } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import { Context } from './Context';
import Auth from './pages/auth/Auth.tsx';
import Home from './pages/home/Home.tsx';
import Join from './pages/join/Join.tsx';
import New from './pages/new/New';
import Play from './pages/play/Play';


function App() {
  const {loaded, gameRoom, user} = useContext(Context);
  return (
    <>
    {gameRoom && <Redirect to = "/play" />}
    {loaded && 
    <Switch>
      <Route exact path = "/">
        <Home />
      </Route>
      <Route path = "/new">
        <New />
      </Route>
      <Route path = "/auth">
        {user? <Redirect to = "/" /> : <Auth />}
      </Route>
      <Route path = "/join">
        <Join />
      </Route>
      <Route path = "/play">
        {gameRoom? <Play /> : <Redirect to = "/" />}
      </Route>
    </Switch>}
    </>
  );
}

export default App;
