import React, { useContext } from 'react'
import { Context } from '../../Context';

import {Redirect} from "react-router-dom";

import "./New.css";

export default () => {
    const {user, API_URL} = useContext(Context);
    function createGame() {
        fetch(`${API_URL}/new?host=${user.displayName}&hostid=${user.uid}`, {method: "POST"})
            .then(res => res.json())
            .then(game => {
                
                window.location = "/play";
                alert("Invite people to play by going to http://localhost:3000/join and entering code " + game.key);
            })
    }
    return (
        <>

        {user?
    
        <>
        <div className = "home">
            <div>
                <h1> BING<i className="ri-focus-2-line"></i></h1>
                <div className = "options">
                    <h2 style = {{textAlign: "center"}}> Create a Room </h2>
                    <br />
                    <label for = "type" style = {{fontSize: 18, marginRight: 20}}> Type   </label>
                   
                    <select className = "green btn small-btn">
                        <option value = {0}> 90 ball bingo </option>
                    </select>
                    <br />
                    <br />
                    <hr />
                    <button className = "btn orange" onClick = {createGame}> Create </button>
                </div>
            </div>
        </div>
        </>:
        <Redirect to = "/auth?return=/new" />
        }
        </>
    )
}