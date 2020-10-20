import React, {useContext} from "react";
import { Context } from "../../Context";

import "./Home.css";

export default () => {
    const {user} = useContext(Context);
    return (
        <>
        <div className = "home">
            <div>
                <h1> BING<i className="ri-focus-2-line"></i></h1>
                
                <div className = "options">
                    <button className = "btn green"  onClick = {() => window.location = "/new"}> 
                        Create a Game
                    </button>
                    <button className = "btn purple"onClick = {() => window.location = "/join"}> Join a Game</button>
                
                    <br />
                    <hr />
                    <div className = "small-btns">

                        <button className = "small-btn btn orange" onClick = {() => window.location = user? "/proflie" : "/auth"}> {user? "View Profile" : "Sign In/Sign Up"} </button>
                        <button disabled className = "small-btn btn blue" onClick = {() => window.location = "/rules"}> See Rules </button>
                    </div>
                </div>
                
                {<span> Play online multiplayer bingo for free!   </span>}
            </div>
        </div>
        </>
    )
}