import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from "../firebase";

export default function Nweet({ nweetObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            // delete nweet
            const docRef = doc(firestore, `nweets/${nweetObj.id}`);
            await deleteDoc(docRef);
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onEditSubmit = async (event) => {
        event.preventDefault();
        const docRef = doc(firestore, `nweets/${nweetObj.id}`);
        await updateDoc(docRef, {
            text: newNweet
        });
        toggleEditing();
    };

    const onEditChange = (event) => {
        const { target: { value } }  = event;
        setNewNweet(value);
    };

    return (
        <div>
            {editing 
                ? <form onSubmit={onEditSubmit}>
                    <input 
                        type="text"
                        value={newNweet} 
                        required 
                        placeholder="Edit your nweet"
                        onChange={onEditChange} />
                        <input type="submit" value="Update Nweet" />
                  </form>
                : <h4>{nweetObj.text}</h4>
            }
            {isOwner && 
                <>
                    <button onClick={onDeleteClick}>Delete Nweet</button>
                    <button onClick={toggleEditing}>Edit Nweet</button>
                </>
            }
        </div>
    );
}