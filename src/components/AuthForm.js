import React, { useState } from "react";
import { fireauth as auth } from "../firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount]= useState(true);
    const [error, setError] = useState('');

    const onChange = (event) => {
        const {
            target: {name, value}
        } = event;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                // create account
                data = await createUserWithEmailAndPassword(auth, email, password)
            } else {
                // log in
                data = await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.code);
        }
    }
    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                name="email"
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email}
                    onChange={onChange} />
                <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={onChange} />
                <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    );
}