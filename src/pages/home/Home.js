import React, { useContext } from "react";
import { Context } from "../../Context";

import "./Home.css";

export default () => {
    const {history} = useContext(Context);
    return (
        <>
        <button onClick = {() => history.push("/new")}> Create a Game </button>
        </>
    )
}