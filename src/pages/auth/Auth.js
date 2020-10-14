import React, { useContext } from 'react'
import { Context } from '../../Context';


import "./Auth.css";

export default () => {
    const {email, setEmail, password, setPassword, signIn, signUp, error, loggingIn} = useContext(Context);
    return (
        <>
        {window.location.search && 
        <>
            Sign in to continue
            <br />
        </>}
        
        <input type = "text" name = "email" value = {email} onChange = {e => setEmail(e.target.value)} />
        <input type = "password" name = "password" value = {password} onChange = {e => setPassword(e.target.value)} />
        <br />
        <button onClick = {signIn}> Sign In </button>
        <button onClick = {signUp}> Sign Up </button>
        <br />
        {loggingIn && "Logging in..."}
        <div style = {{color: "red"}}>
            {error.message}
        </div>
        </>
    );
}