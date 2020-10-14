import React, { useContext } from 'react';
import { Redirect } from "react-router-dom";
import { Context } from '../../Context';

import "./Join.css";

export default () => {
    const {user} = useContext(Context);
    return (
        <>
        {user?
        <input />:
        <Redirect to = "/auth?return=/join" />}
        </>
    )
}