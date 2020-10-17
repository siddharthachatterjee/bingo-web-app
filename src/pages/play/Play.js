import React, { useContext } from 'react'
import { Context } from '../../Context';

import "./Play.css";

export default () => {
    const {game, API_URL, currentPlayer, timeTillNext} = useContext(Context);
    function start() {
       // console.log(game.key)
        fetch(`${API_URL}/start/${game.key}`, {method: "PUT"})
    }
    function buyTicket() {
      //  if (e.target.value === "buy")
        fetch(`${API_URL}/buy/${game.key}?playerid=${currentPlayer.id}`, {method: "PUT"})
    }
    function callBingo() {
        fetch(`${API_URL}/call-bingo/${game.key}?playerid=${currentPlayer.id}`, {method:"PUT"})
            .then(res => res.text())
            .then(data => {
                console.log(data);
            })
    }
    return (
        <>
        {game && (
            <div style = {{margin: 10}}>
            <div style = {{display: "none"}}>

                {game.key}
                {currentPlayer.id}
            </div>
            <br />
            <div>
                <h3> Players({game.players.length}): </h3>
                {game.players.map(player => (
                    <div> {player.name} {player.id === currentPlayer.id && "(You)"} {player.id === game.hostid && "(Host)"} </div>
                ))}
            </div>
            {(game.started && !game.ended) ?
            <> 
            <h2> Last number called: {game.lastNumberCalled}</h2>
            <h4> Next number will be called in {timeTillNext? timeTillNext : "calculating..."} </h4>
            <button onClick = {callBingo}> Call Bingo(This will gain you money if you have 5 in a row or full house) </button>
            </>:
            !game.ended && <>
            
            <button  onClick = {start}> Start Game </button>
            {currentPlayer.money > 2 && <button value = "buy"onClick = {buyTicket}> Buy Ticket (Costs $2)</button>}
            </>}
            
            <h3> Your money: ${currentPlayer.money}</h3>
            <h3> Your Tickets: </h3>
            {!currentPlayer.tickets.length && `You have no tickets yet, buy one by clicking on "Buy Ticket"`}
            {currentPlayer.tickets.map(ticket => (
                <>
                <div className = "ticket">
                    {ticket.map(row => row.map(square => (
                        <div className = {`square ${square && square.covered? "covered" : ""}`} style = {{background: !square && "pink"}}>
                            {square && square.value}
                            
                        </div>
                    )))}
                   
                </div>
                </>
            ))}
            </div>
        )}
        </>
    )
}