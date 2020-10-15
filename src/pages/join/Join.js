import React, { useContext, useState } from 'react';
import { Redirect } from "react-router-dom";
import { Context } from '../../Context';

import "./Join.css";

export default () => {
    const {user, API_URL} = useContext(Context);
    const [val, setVal] = useState("");
    function join() {
        fetch(`${API_URL}/join/${val}?name=${user.displayName}&id=${user.uid}`, {method: "PUT"})
            .then(res => {
                if (res.status === 404) {
                    alert(res.statusText);
                }
                return res.text()
            })
            .then((data) => {
                console.log(data)
                if (!data.length) {
                    window.location = "/play"
                }
            })
    }
    return (
        <>
        {user?
        <>
        Room code:
        <input 
            placeholder = "000000"
            value = {val}
            onChange = {e => setVal(e.target.value)}
        />
        <br />
        <button onClick = {join}> Join </button>
        </>:
        <Redirect to = "/auth?return=/join" />}
        </>
    )
}