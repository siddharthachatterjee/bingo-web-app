import React, { useContext, useState } from 'react'
import { Context } from '../../Context';

import "./Play.css";

export default () => {
    const {game, API_URL, currentPlayer, timeTillNext} = useContext(Context);
    const [message, setMessage] = useState("");
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
    function sendMessage() {
        fetch(`${API_URL}/chat/${game.key}?from=${currentPlayer.name}&body=${message}`, {method: "PUT"});
        setMessage("");
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
                {game.players.map((player, i) => (
                    <div key = {`player${i}`}> {player.name} {player.id === currentPlayer.id && "(You)"} {player.id === game.hostid && "(Host)"} </div>
                ))}
            </div>
            {(game.started && !game.ended) ?
            <> 
            <h2> Last number called: {game.lastNumberCalled}</h2>
            <h4> Next number will be called in {timeTillNext} </h4>
            {(!currentPlayer.fullHouse && currentPlayer.coveredRows.length < 4) && <button onClick = {callBingo}> Call Bingo(This will gain you money if you have 5 in a row or full house) </button>}
            </>:
            !game.ended && <>
            
            <button  onClick = {start}> Start Game </button>
            {currentPlayer.money > 2 && <button value = "buy"onClick = {buyTicket}> Buy Ticket (Costs $2)</button>}
            </>}
            
            <h3> Your money: ${currentPlayer.money}</h3>
            <h3> Your Tickets: </h3>
            {!currentPlayer.tickets.length && `You have no tickets yet, buy one by clicking on "Buy Ticket"`}
            <div className = "tickets">
                {currentPlayer.tickets.map((ticket, i) => (
                    <>
                    <div className = "ticket" key = {`ticket${i}`}>
                        {ticket.map(row => row.map(square => (
                            <div className = {`square ${square && square.covered? "covered" : ""}`} style = {{background: !square && "pink"}}>
                                {square && square.value}
                                
                            </div>
                        )))}
                    
                    </div>
                    </>
                ))}
            </div>
            <div className = "side-panel">
                <h2> CHAT</h2>
                {game.chat.map((message, i) => (
                    <div className = "message" key = {`message${i}`}>
                        {(i === 0 || game.chat[i - 1].from != message.from) && <strong> {message.from}: </strong>}
                        {message.body}
                    </div>
                ))}
                <div className = "send-message">
                    <input value = {message} onChange = {e => setMessage(e.target.value)} />
                    <button onClick = {sendMessage}> Send Message </button>
                </div>
            </div>
            {game.enableAutoMark ? <> <br /> <br />Auto-mark is enabled. This means the computer will automatically mark off a number on your ticket(s) when it is called. </>: ""}
            </div>
        )}
        </>
    )
}