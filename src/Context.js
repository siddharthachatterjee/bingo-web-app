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
export const API_URL = 
  //  process.env.NODE_ENV === "development" ? "http://localhost:8080" : 
    "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com";

const socket = require("socket.io-client")(API_URL);
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
    const [lastNumberCalled, setLastNumberCalled] = useState(null);
    const [update, setUpdate] = useState("");

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
                setLastNumberCalled(data.lastNumberCalled);
                setTimeTillNext(data.timeTillNextCall);
                if (data.started && !started) setStarted(true)
                setCurrentPlayer(data.players.find(player => player.id === user.uid));
                if (data.lastNumberCalled && data.timeTillNextCall === 5) {
                    let voices = window.speechSynthesis.getVoices();
             //   if (game.lastNumberCalled && timeTillNext === 0) {
                    let voice = voices.find(voice => voice.name === "Google US English");
                    let speech = new SpeechSynthesisUtterance();
                    speech.voice = voice;
                    speech.voiceURI = "native";
                   // speech.volume = 3;
                    speech.rate = 0.8;
                    speech.text = `${data.lastNumberCalled} was called!`;
                    speech.lang = "en-US";
                    window.speechSynthesis.speak(speech);
                }
               // console.log(data);
            });
            socket.on(`full-house-${gameRoom}`, player => {
                setUpdate(`${player.name} achieved full house and gained +$${player.increase}`);
                
                fetchGame();
            });
            socket.on(`five-in-row-${gameRoom}`, player => {
                setUpdate(`${player.name} achieved five in row and gained +$${player.increase}`);
                fetchGame();
            })
            socket.on(`false-bingo-${gameRoom}`, player => {
                setUpdate(`${player.name} called bingo incorrectly and lost -$2`)
                fetchGame();
            })
        }
    // eslint-disable-next-line
    }, [gameRoom])
    useEffect(() => {
        if (update.length) {
            let voices = window.speechSynthesis.getVoices();
                     //   if (game.lastNumberCalled && timeTillNext === 0) {
            let voice = voices.find(voice => voice.name === "Google US English");
            let speech = new SpeechSynthesisUtterance();
            speech.voice = voice;
            speech.voiceURI = "native";
            speech.volume = 3;
            speech.rate = 0.8;
            speech.text = update;
            speech.lang = "en-US";
            window.speechSynthesis.speak(speech);
            speech.onend = () => {
                setUpdate("")
            }
        } else {
            window.speechSynthesis.cancel()
        }
    }, [update])

    const [user, setUser] = useState(firebase.auth().currentUser)
    useEffect(() => {
        let lastTime = new Date().getTime() - time;
        console.log(`Context loaded - ${lastTime}ms`)
        socket.on("connect", () => {
            console.log(`Websocket loaded - ${new Date().getTime() - time}ms`);
           // lastTime = new Date().getTime() - time;
        })
        firebase.auth().onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser)
            setLoaded(true);
            console.log(`Auth loaded - ${new Date().getTime() - time}ms`)
           // lastTime = new Date().getTime() - time;
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
                                console.log(`Game loaded - ${(new Date().getTime() - time)}ms`);
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
               
                window.location = window.location.search.split("=")[1] || "/"
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
                    window.location = window.location.search.split("=")[1] || "/"
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
            lastNumberCalled,
            history,
            loggingIn,
            loaded,
            update,
            setUpdate
        }}>
            {props.children}
        </Context.Provider>
    )
}