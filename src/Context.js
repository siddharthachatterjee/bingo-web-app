import React, { useEffect, useState } from "react";

import {useHistory} from "react-router-dom";

import firebase from "./firebase";

export const Context = React.createContext();

export const ContextProvider = (props) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const API_URL = "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com";
    const history = useHistory();
    const socket = require("socket.io-client")(`ws://${API_URL.split("//")[1]}`);
    const [game, setGame] = useState(null);
    const [gameRoom, setGameRoom] = useState(localStorage.getItem("current-game") || "");
    const [loggingIn, setLoggingIn] = useState(false);
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        socket.on(`game${gameRoom}-updated`, (data) => {
            setGame(data);
            console.log(data);
        })
        
    }, [gameRoom])
    const [user, setUser] = useState(firebase.auth().currentUser)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser)
            setLoaded(true);
        })
    }, [])
    const [password, setPassword] = useState("");
    function signIn() {
        setLoggingIn(true);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoggingIn(false);
                setUser(firebase.auth().currentUser);
                history.push(window.location.search.split("=")[1] || "/profile")
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
                history.push(window.location.search.split("=")[1] || "/profile")
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