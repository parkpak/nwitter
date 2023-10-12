import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { fireauth } from "../firebase";

function App() {
  const currentUser = fireauth.currentUser;
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(currentUser);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    fireauth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
