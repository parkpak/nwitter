import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

export default function Router({ isLoggedIn, userObj, refreshUser }) {
    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn
                    ? (
                        <>
                            <Route path="/" element={<Home userObj={userObj} />} />
                            <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
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
        </BrowserRouter>
    )
}