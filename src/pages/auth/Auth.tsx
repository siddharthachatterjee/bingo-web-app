import React, { useContext } from 'react'
import { Context } from '../../Context';


import "./Auth.css";


export default (): JSX.Element => {
    const {email, setEmail, password, setPassword, signIn, signUp, error, loggingIn} = useContext(Context);
    return (
        <>
        <div className = "home">
            <div>
                <h1> BING<i className="ri-focus-2-line"></i></h1>
                <div className = "options">          
                    {
                    <>
                        <h2 style = {{textAlign: "center"}}> Sign In {window.location.search && "to Continue"} </h2>
                    
                    </>}
                    <label htmlFor = "email"> Email </label>
                    <input autoComplete = "off" className = "txt-inpt"type = "text" name = "email" value = {email} onChange = {e => setEmail(e.target.value)} />
                    <label htmlFor = "password"> Password </label>
                    <input autoComplete = "new-password" type = "password" className = "txt-inpt" name = "password" value = {password} onChange = {e => setPassword(e.target.value)} />
                    <br />
                    <button className = "btn green"onClick = {signIn}> Sign In </button>
                    <button className = "btn purple"onClick = {signUp}> Sign Up </button>
                
                    <br />
                    {loggingIn ? 
                    <div className = "cover-layer">
                        Logging in...
                    </div>
                    :         
                    <div style = {{color: "red"}}>
                        {error.message}
                    </div>}
                </div>
            </div>
        </div>
        </>
    );
}