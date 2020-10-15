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

export const ContextProvider = (props) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const API_URL = process.env.NODE_ENV === 'development'? "http://localhost:8000" : "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com";
    const history = useHistory();
    const socket = require("socket.io-client")(`ws://${API_URL.split("//")[1]}`, {
        transports: ["polling"]
    });
    const [game, setGame] = useState(null);
    const [gameRoom, setGameRoom] = useState(null);
    const [loggingIn, setLoggingIn] = useState(false);
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        if (gameRoom) {
            socket.on(`game${gameRoom}-updated`, (data) => {
                setGame(data);
                console.log(data);
            })
        }
    // eslint-disable-next-line
    }, [gameRoom])
    const [user, setUser] = useState(firebase.auth().currentUser)
    useEffect(() => {
        
        firebase.auth().onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser)
            setLoaded(true);
            if (firebaseUser) {
                fetch(`${API_URL}/games`)
                    .then(res => res.json())
                    .then(data => {
                        for (let room in data) {
                            //console.log(data[room])
                            if (data[room].players.some(player => player.id === firebaseUser.uid)) {
                            
                                setGameRoom(room);
                                setGame(data[room])
                                break;
                            };
                        }
                    })
                }
        })
    }, [API_URL])
    const [password, setPassword] = useState("");
    function signIn() {
        setLoggingIn(true);
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
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                setLoggingIn(false);
                firebase.auth().currentUser.sendEmailVerification();
                firebase.auth().currentUser.updateProfile({
                    displayName: email.split("@")[0]
                })
                setUser(firebase.auth().currentUser);
                window.location = window.location.search.split("=")[1] || "/profile"
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
            password, setPassword, 
            signIn, 
            signUp,
            API_URL,
            game,
            gameRoom,
            setGameRoom,
            history,
            loggingIn,
            loaded
        }}>
            {props.children}
        </Context.Provider>
    )
}