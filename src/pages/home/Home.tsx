import React, {useContext} from "react";
import { Context } from "../../Context";

import "./Home.css";

export default (): JSX.Element => {
    const {user}: {user: firebase.User} = useContext(Context);
    return (
        <>
        <div className = "home">
            <div>
                <h1> BING<i className="ri-focus-2-line"></i></h1>
                
                <div className = "options">
                    <button className = "btn green"  onClick = {() => window.location.pathname = "/new"}> 
                        Create a Game
                    </button>
                    <button className = "btn purple"onClick = {() => window.location.pathname = "/join"}> Join a Game</button>
                
                    <br />
                    <hr />
                    <div className = "small-btns">

                        <button className = "small-btn btn orange" onClick = {() => window.location.pathname = user? "/proflie" : "/auth"}> {user? "View Profile" : "Sign In/Sign Up"} </button>
                        <button disabled className = "small-btn btn blue" onClick = {() => window.location.pathname = "/rules"}> See Rules </button>
                    </div>
                </div>
                
                {<span> Play online multiplayer bingo for free!   </span>}
            </div>
        </div>
        </>
    )
}