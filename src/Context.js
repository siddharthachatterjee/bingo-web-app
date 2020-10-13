import React, { useState } from "react";
import {} from "react-router-dom";

import firebase from "./firebase";

export const Context = React.createContext();

export const ContextProvider = (props) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
   // const history = 
    const [user, setUser] = useState(firebase.auth().currentUser)
    const [password, setPassword] = useState("");
    function signIn() {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setUser(firebase.auth().currentUser);
                
            })
    }
    return (
        <Context.Provider value = {{error, setError, email, setEmail, user, password, setPassword, signIn}}>
            {props.children}
        </Context.Provider>
    )
}