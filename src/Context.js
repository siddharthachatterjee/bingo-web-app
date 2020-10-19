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
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";

import firebase from "./firebase";

export const Context = React.createContext();
const time = new Date().getTime();
const API_URL = 
  //  process.env.NODE_ENV === "development" ? "http://localhost:8080" : 
    "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com";

const socket = require("socket.io-client")(`http://${API_URL.split("//")[1]}`);
console.log("TIMELINE");
export const ContextProvider = (props) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const history = useHistory();
    const [game, setGame] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [gameRoom, setGameRoom] = useState(null);
    const [loggingIn, setLoggingIn] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [timeTillNext, setTimeTillNext] = useState(0);
    const [started, setStarted] = useState(false);

    function fetchGame() {
        fetch(`${API_URL}/games/${gameRoom}`)
            .then(res => res.json())
            .then(data => {
                setGame(data);
                setCurrentPlayer(data.players.find(player => player.id === user.uid));
            })
    }

    useEffect(() => {
        if (gameRoom) {
            socket.on(`game${gameRoom}-updated`, (data) => {
                setGame(data);
                if (data.started && !started) setStarted(true)
                setCurrentPlayer(data.players.find(player => player.id === user.uid))
               // console.log(data);
            });
            socket.on(`full-house-${gameRoom}`, player => {
                alert(`${player.name} achieved full house and gained +$${player.increase}`);
                fetchGame();
            });
            socket.on(`five-in-row-${gameRoom}`, player => {
                alert(`${player.name} achieved five in row and gained +$${player.increase}`);
                fetchGame();
            })
            socket.on(`false-bingo-${gameRoom}`, player => {
                alert(`${player.name} called bingo incorrectly and lost -$2`)
                fetchGame();
            })
        }
    // eslint-disable-next-line
    }, [gameRoom])
    useEffect(() => {
        if (started && game.availableNumbers.length) {
            if (timeTillNext === 0) {
                fetch(`${API_URL}/games/${gameRoom}`)
                    .then(res => res.json())
                    .then(data => {
                        setGame(data);
                        setCurrentPlayer(data.players.find(player => player.id === user.uid))
                        setTimeTillNext(5);
                       // window.location.reload()
                    })
            } else {
                setTimeout(() => {
                    setTimeTillNext(prev => prev - 1);
                }, 1000)
            }
        }
    // eslint-disable-next-line
    }, [started, timeTillNext])
    const [user, setUser] = useState(firebase.auth().currentUser)
    useEffect(() => {
        let lastTime = new Date().getTime() - time;
        console.log(`App loaded - ${lastTime}ms`)
        socket.on("connect", () => {
            console.log(`Websocket loaded - ${new Date().getTime() - time}ms [took ${(new Date().getTime() - time) - lastTime}ms]`);
            lastTime = new Date().getTime() - time;
        })
        firebase.auth().onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser)
            setLoaded(true);
            console.log(`Auth loaded - ${new Date().getTime() - time}ms [took ${(new Date().getTime() - time) - lastTime}ms]`)
            lastTime = new Date().getTime() - time;
            if (firebaseUser) {
                fetch(`${API_URL}/games`)
                    .then(res => res.json())
                    .then(data => {
                        for (let room in data) {
                            //console.log(data[room])
                            let player = data[room].players.find(player => player.id === firebaseUser.uid);
                            if (player) {
                                setCurrentPlayer(player)
                                setGameRoom(room);
                                setGame(data[room])
                               
                                setTimeTillNext(data[room].timeTillNextCall);
                                setStarted(data[room].started)
                                console.log(`Game loaded - ${(new Date().getTime() - time)}ms [took ${((new Date().getTime() - time) - lastTime)}ms]`);
                                lastTime = new Date().getTime() - time;
                                break;
                            };
                        }
                    })
                }
        })
    }, [])
    const [password, setPassword] = useState("");
    function signIn() {
        setLoggingIn(true);
        setError("");
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoggingIn(false);
                setUser(firebase.auth().currentUser);
               
                window.location = window.location.search.split("=")[1] || "/profile"
            })
            .catch(err => {
                setLoggingIn(false);
                setError(err);
            })
    }
    function signUp() {
        setLoggingIn(true);
        setError("")
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                setLoggingIn(false);
                firebase.auth().currentUser.updateProfile({
                    displayName: email.split("@")[0]
                }).then(() => {
                    firebase.auth().currentUser.sendEmailVerification();
                    setUser(firebase.auth().currentUser);
                    window.location = window.location.search.split("=")[1] || "/profile"
                })
            })
            .catch(err => {
                setLoggingIn(false);
                setError(err)
            })
    }
    return (
        <Context.Provider value = {{
            error, setError, 
            email, setEmail, 
            user, 
            currentPlayer,
            password, setPassword, 
            signIn, 
            signUp,
            API_URL,
            game,
            gameRoom,
            setGameRoom,
            timeTillNext,
            history,
            loggingIn,
            loaded
        }}>
            {props.children}
        </Context.Provider>
    )
}