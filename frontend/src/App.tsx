import { useState, useRef } from "react";
import Auth from "./components/Auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Playground from "./components/Playground";
import io from "socket.io-client";

export const socket = io("http://localhost:4000");

function App() {
  const [authenticated, setAuthenticated] = useState<null | string>(null);
  const [room, setRoom] = useState<null | number>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthenticated(null);
      console.log("signout");
      setRoom(null);
      cookies.remove("auth-token");
    } catch (error) {
      console.log(error);
    }
  };

  const roomValueToNumber = (value: string | undefined) => {
    if (value) {
      setRoom(Number(value));
    } else return;
  };

  if (!authenticated) {
    return (
      <>
        <h1 className="text-base font-bold text-green-400">Welcome</h1>
        <Auth setAuthenticated={setAuthenticated} />
      </>
    );
  }

  return (
    <div>
      {/* {room ? (
        <Playground />
      ) : (
        <div>
          <h1>Enter Room {room}</h1>
          <input type="number" ref={inputRef} />
          <button onClick={() => roomValueToNumber(inputRef.current?.value)}>
            Enter
          </button>
        </div>
      )} */}
      <Playground />
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default App;
