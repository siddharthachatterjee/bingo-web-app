import React from "react";
//import { Context } from "../../Context";

import "./Home.css";

export default () => {
    //const {history} = useContext(Context);
    return (
        <>
        <button onClick = {() => window.location = "/new"}> Create a Game </button>
        <button onClick = {() => window.location = "/join"}> Join a Game</button>
        </>
    )
}