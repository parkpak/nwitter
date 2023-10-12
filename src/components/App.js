import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { fireauth } from "../firebase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    fireauth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setUserObj(prev => ({ ...prev, displayName: fireauth.currentUser.displayName }));
  };

  return (
    <>
      {init 
        ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> 
        : "Initializing..."
      }
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
