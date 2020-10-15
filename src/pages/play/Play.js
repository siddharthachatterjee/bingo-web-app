import React, { useContext } from 'react'
import { Context } from '../../Context';

import "./Play.css";

export default () => {
    const {game, API_URL} = useContext(Context);
    function start() {
       // console.log(game.key)
        fetch(`${API_URL}/start/${game.key}`, {method: "PUT"})
    }
    return (
        <>
        {JSON.stringify(game)}
        {game && !game.started && (
            <>
            <br />
            <button onClick = {start}> Start Game </button>
            </>
        )}
        </>
    )
}