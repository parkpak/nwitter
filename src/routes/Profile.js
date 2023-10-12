import React, { useEffect, useState } from "react";
import { fireauth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function Profile({ userObj, refreshUser }) {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        fireauth.signOut().then(() => {
            navigate('/');
        });
    };

    const getMyNweets = async () => {
    const nweetsRef = collection(firestore, "nweets");
    const q = query(nweetsRef, where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(doc => console.log(doc.data()));
    };

    useEffect(() => {
        getMyNweets();
    }, []);

    const onProfileSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, {
                displayName: newDisplayName
            });
            refreshUser();
        }
    };

    const onDisplayNameChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    };

    return (
        <>
            <form onSubmit={onProfileSubmit}>
                <input
                    name="displayName"
                    type="text"
                    value={newDisplayName}
                    placeholder="Display name"
                    onChange={onDisplayNameChange}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}