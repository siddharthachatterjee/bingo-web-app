import React, { useContext, useEffect, useState } from 'react'
import { Context, API_URL } from '../../Context';

import "./Play.scss";

function start(game, currentPlayer) {
    // console.log(game.key)
     fetch(`${API_URL}/start/${game.key}`, {method: "PUT"})
 }
 function buyTicket(game, currentPlayer) {
   //  if (e.target.value === "buy")
   console.log("hello world")
     fetch(`${API_URL}/buy/${game.key}?playerid=${currentPlayer.id}&passcode=${game.key}`, {method: "put"})
 }
 function callBingo(game, currentPlayer) {
     fetch(`${API_URL}/call-bingo/${game.key}?playerid=${currentPlayer.id}`, {method:"PUT"})
         .then(res => res.text())
         .then(data => {
             console.log(data);
         })
 }
 function sendMessage(game, currentPlayer, message) {
     fetch(`${API_URL}/chat/${game.key}?from=${currentPlayer.name}&body=${message}`, {method: "PUT"});
     //setMessage("");
 }
export default () => {
    const {game, currentPlayer, timeTillNext, update, setUpdate, API_URL, lastNumberCalled} = useContext(Context);
    
    const [audio] = useState(new Audio("/music.mp3"))
    
    const [message, setMessage] = useState("");
    const [playMusic, setPlayMusic] = useState(true);
    useEffect(() => {
        //const audioElem = document.getElementById("music");
        // audio.play()
        // if (audioElem) {
            if (playMusic) {
                
                audio.play();
                audio.addEventListener("ended", () => {
                    audio.play()
                })
            } else {
                audio.pause();
            }
            // }
    }, [playMusic, audio])

    
  
    return (
        <>
     
        {game && (
            

            <div className = "play">
            {update && (
                <>
                <div className = "cover-layer"  onClick = {() => setUpdate("")}></div>
                <div className = "modal" onClick = {() => setUpdate("")}>
                    <h2> {update.split(" ")[0]}: </h2>
                    <h3> {update.split(" ").slice(1).join(" ")}! </h3>
                    <p>
                        Click anywhere to close
                    </p>
                </div>
                </>
            )}
            <div className = "options">
                <div style = {{display: "none"}}>

                    {game.key}
                    {currentPlayer.id}
                </div>
                <h2> Room {game.key} </h2>
                <div>
                    <h3> Hosted by {game.host} </h3>
                    {/* <h3> Players({game.players.length}): </h3>
                    {game.players.map((player, i) => (
                        <div key = {`player${i}`}> {player.name} {player.id === currentPlayer.id && "(You)"} {player.id === game.hostid && "(Host)"} </div>
                    ))} */}
                    <div> {game.players.length} player{game.players.length > 1 ? "s are" : " is"} in this room </div>
                </div>
                <br />
                
                <button onClick = {() => setPlayMusic(prev => !prev)}className = "btn orange xsmall-btn">
                    {playMusic? <i title = "mute music"className="ri-volume-mute-fill"></i> : <i title = "play music"className="ri-volume-up-fill"></i>}
                </button>
                {!game.started && !game.ended && <>
                    {
                    <button className = "btn green xsmall-btn"  onClick = {() => start(game, currentPlayer)} disabled = {game.hostid !== currentPlayer.id}> 
                    <i className="ri-play-fill"></i>
                    </button>}
                    {currentPlayer.money > 2 && <button  className = "btn purple xsmall-btn"value = "buy"onClick = {() => buyTicket(game, currentPlayer)}> Buy Ticket* </button>}
                    <br />
                    *Ticket costs $2
                    {game.hostid !== currentPlayer.id && <div> <br /> You cannot start the game, because you are not the host. Waiting for host to start the game... </div>}
                </>}
                <br />
                {(game.started && !game.ended) &&
                <> 
                <h2> Last number called: {lastNumberCalled}</h2>
                <h4> Next number will be called in {timeTillNext} </h4>
                {(!currentPlayer.fullHouse && currentPlayer.coveredRows.length < 4) && <button onClick = {() => callBingo(game, currentPlayer)} className = "btn blue"> Call Bingo </button>}
                </>}
                
                
            </div> 
           

            <main>

                <h2> Your money: ${currentPlayer.money}</h2>
                <h3> Your Tickets: </h3>
                {!currentPlayer.tickets.length && `You have no tickets yet, buy one by clicking on "Buy Ticket"`}
                <div className = "tickets">
                    {currentPlayer.tickets.map((ticket, i) => (
                        
                        <div className = "ticket" key = {`ticket${i}`}>
                            {ticket.map((row, j) => row.map((square, k) => (
                                <button title = {square && square.value === lastNumberCalled && "Mark this square"}onClick = {() => fetch(`${API_URL}/mark/${game.key}?playerid=${currentPlayer.id}&ticket=${i}&row=${j}&col=${k}`, {method: "PUT"})} disabled = {!square || game.lastNumberCalled !== square.value} key = {`ticket${i}${j}${k}`}className = {`square ${square && square.covered? "covered" : ""}`} style = {{background: !square && "darkviolet"}}>
                                    {square && square.value}
                                    
                                </button>
                            )))}
                        
                        </div>
                    
                    ))}
                </div>
            </main>
            <div className = "options" style = {{display: "flex", flexDirection: "column"}}>
                <h2 style = {{margin: 0}}> Leaderboard </h2>
                
                <ol>

                    {game.players.sort((player1, player2) => player2.money - player1.money).slice(0, 10).map((player, i) => (
                        <li> {player.name} - ${player.money}</li>
                    ))}
                </ol>
                <br />
                <div style = {{height: 1, background: "white"}}></div>
                <h2> CHAT </h2> 
                <div className = "messages" style = {{overflowY: "scroll"}}>

                    {game.chat.map((message, i) => (
                        <div className = "message" key = {`message${i}`}>
                            {(i === 0 || game.chat[i - 1].from !== message.from) && <strong> {message.from}: </strong>}
                            {message.body}
                        </div>
                    ))}
                </div>
                <div className = "send-message">
                    <form onSubmit = {e => {
                        e.preventDefault();
                        sendMessage(game, currentPlayer, message);
                        setMessage("")
                    }}>

                        <input className = "txt-inpt" placeholder = "Your message..."value = {message} onChange = {e => setMessage(e.target.value)} />
                    </form>
                    {/* <button className = "btn blue"onClick = {sendMessage}> Send Message </button> */}
                </div>
            </div>
            
            {/* {game.enableAutoMark ? <> <br /> <br />Auto-mark is enabled. This means the computer will automatically mark off a number on your ticket(s) when it is called. </>: ""} */}
            </div>
        )}
        </>
    )
}