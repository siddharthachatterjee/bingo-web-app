import React, { useContext } from 'react'
import { Context } from '../../Context';

import {Redirect} from "react-router-dom";

import "./New.css";

export default () => {
    const {user, API_URL, setGameRoom, history} = useContext(Context);
    function createGame() {
        fetch(`${API_URL}/new?host=${user.displayName}&hostid=${user.uid}`, {method: "POST"})
            .then(res => res.json())
            .then(game => {
                localStorage.setItem("current-game", game.key)
                setGameRoom(game.key)
                history.push(`/game/${game.key}`)
            })
    }
    return (
        <>

        {user?
        <>
        type: 
        <select>
            <option value = {0}> 90 ball bingo </option>
        </select>
        <br />
        <button onClick = {createGame}> Create </button>
        </>:
        <Redirect to = "/auth?return=/new" />
        }
        </>
    )
}