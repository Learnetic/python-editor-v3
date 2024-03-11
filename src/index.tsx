/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {MauthorCommunication} from "./MauthorCommunication";

declare global {
    interface Window {
        eventCode: any;
        mauthor: any;
    }
}



const mAConn = MauthorCommunication.getInstance();
window.mauthor = mAConn;

mAConn.sendMessage('CUSTOM_EVENT', "EDITOR_READY");


ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
