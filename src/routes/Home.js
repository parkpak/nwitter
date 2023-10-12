import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { addDoc, onSnapshot ,collection, query, orderBy } from "firebase/firestore";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    const path = "nweets";
    const collectinoRef = collection(firestore, path);

    useEffect(() => {
        const collectionQ = query(collectinoRef, orderBy("createdAt", "desc"));
        onSnapshot(collectionQ, (snapshot) => {
            console.log(snapshot);
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collectinoRef, {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet('');
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    type="text"
                    value={nweet}
                    placeholder="What's on your mind?" 
                    maxLength={120}
                    onChange={onChange} 
                />
                <input type="submit" value="NWeet" />
            </form>
            <div>
                {nweets.map(nweet => (
                    <div key={nweet.id}>
                        <h4>{nweet.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;