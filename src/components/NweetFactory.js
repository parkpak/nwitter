import React, { useState } from "react";
import { firestorage, firestore } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc ,collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function NweetFactory({ userObj }) {
    const [nweet, setNweet] = useState('');
    const [attachment, setAttachment] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = '';
        if (attachment != "") {
            const attachmentRef = ref(firestorage, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const newNweet = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        const collectinoRef = collection(firestore, "nweets");
        await addDoc(collectinoRef, newNweet);
        setNweet('');
        setAttachment('');
    };

    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        if (theFile) {
            reader.readAsDataURL(theFile);
        } else {
            setAttachment('');
        }
    };

    const onClearAttachment = () => setAttachment('');

    return (
        <form onSubmit={onSubmit}>
            <input 
                type="text"
                value={nweet}
                placeholder="What's on your mind?" 
                maxLength={120}
                required
                onChange={onChange} 
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="NWeet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>clear</button>
                </div>
            )}
        </form>
    );
}