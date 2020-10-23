import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import { Context } from '../../Context';

import "./Join.css";

export default () => {
    const {user, API_URL} = useContext(Context);
    const [val, setVal] = useState("");
    const [joining, setJoining] = useState(false);
    useEffect(() => {
        const input = document.querySelector("input");
        if (input)
        input.focus();
    }, [])
    function join() {
        setJoining(true);
        fetch(`${API_URL}/join/${val}?name=${user.displayName}&id=${user.uid}`, {method: "PUT"})
            .then(res => {
                if (res.status === 404) {
                    alert("Room not found. You may have incorrectly entered a room code.");
                }
                return res.text()
            })
            .then((data) => {
                //console.log(data);
                if (!data.length) {
                    window.location.pathname = "/play"
                }
                setJoining(false);
            })
    }
    return (
        <>
        {user?
        <>
        {joining && <div className = "cover-layer">
            
        </div>}
        <div className = "home">
            <div>
                <h1> BING<i className="ri-focus-2-line"></i></h1>
                <div className = "options">
                    <h2 style = {{textAlign: "center"}}>Room Code: </h2>

                    <input 
                        placeholder = "000000"
                        className = "code-inpt"
                        value = {val}
                        type = "text" 
                        
                        maxLength = {6}
                        onChange = {e => setVal(e.target.value)}
                    />
                    <br />
                    <button className = "btn green"onClick = {join}> Join </button>
                </div>
            </div>
        </div>
        </>:
        <Redirect to = "/auth?return=/join" />}
        </>
    )
}