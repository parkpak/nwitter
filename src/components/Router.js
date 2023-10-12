import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

export default function Router({ isLoggedIn, userObj }) {
    return (
        <HashRouter>
            {isLoggedIn && <Navigation />}
            <Routes>
                {isLoggedIn
                    ? (
                        <>
                            <Route path="/" element={<Home userObj={userObj} />} />
                            <Route path="/profile" element={<Profile />} />
                        </>
                    )
                    : (
                        <>
                            <Route path="/" element={<Auth />} />
                            {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
                        </>
                    )
                }
            </Routes>
        </HashRouter>
    )
}