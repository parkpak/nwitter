import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestorage, firestore } from "../firebase";
import { addDoc, onSnapshot ,collection, query, orderBy } from "firebase/firestore";
import Nweet from "../components/Nweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState('');
    const collectinoRef = collection(firestore, "nweets");

    useEffect(() => {
        const collectionQ = query(collectinoRef, orderBy("createdAt", "desc"));
        onSnapshot(collectionQ, (snapshot) => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

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
        <div>
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
            <div>
                {nweets.map(nweet => (
                    <Nweet 
                        key={nweet.id} 
                        nweetObj={nweet} 
                        isOwner={nweet.creatorId === userObj.uid} 
                    />
                ))}
            </div>
        </div>
    )
}

export default Home;