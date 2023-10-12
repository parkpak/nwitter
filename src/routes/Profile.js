import React from "react";
import { fireauth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        fireauth.signOut().then(() => {
            navigate('/');
        });
    }

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}