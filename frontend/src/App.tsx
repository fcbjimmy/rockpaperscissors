import { useState, useRef, useEffect } from "react";
import Auth from "./components/Auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Playground from "./components/Playground";
import { socket } from "./utils/socketIo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [authenticated, setAuthenticated] = useState<null | string>(null);
  const [room, setRoom] = useState<null | string>(null);
  const [selected, setSelected] = useState<null | number>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const options: number[] = [2, 3, 4];

  useEffect(() => {
    console.log(selected);
  }, [selected]);

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

  //Create Room

  const createRoom = (value: string | undefined) => {
    console.log(value, selected);
    if (value && selected) {
      socket.emit("create_room", {
        room: value,
        number: selected,
        id: socket.id,
      });
    }
  };

  //Listen to room taken / created

  useEffect(() => {
    socket.on("roomTaken", (data) => {
      console.log(data);
      toast.warn(data, {
        position: toast.POSITION.TOP_CENTER,
      });
    });
    return () => {
      socket.off("roomTaken", () => {});
    };
  }, []);

  useEffect(() => {
    socket.on("roomCreated", (data) => {
      console.log(data);
      toast.success(data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
      setRoom(data.room);
    });

    return () => {
      socket.off("roomCreated", (data) => {
        console.log(data);
      });
    };
  }, []);

  const roomValueToNumber = (value: string | undefined) => {
    if (value) {
      setRoom(value);
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
      {room ? (
        <Playground room={room} />
      ) : (
        <div className="h-screen w-screen">
          <div className="flex flex-col justify-center items-center h-[100%] gap-2">
            <div className="flex gap-5">
              <input
                type="string"
                ref={inputRef}
                className="border border-black p-2 rounded"
                placeholder="Create Room"
              />
              <select
                className="border p-2 rounded"
                onChange={(e) => setSelected(Number(e.target.value))}
              >
                <option>No. of players</option>
                {options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() => createRoom(inputRef.current?.value)}
                className="border p-1 rounded"
              >
                Create and Join
              </button>
            </div>
            <div>
              <h1>Or</h1>
            </div>
            <div className="flex gap-5">
              <input
                type="string"
                // ref={inputRef}
                className="border border-black p-2 rounded"
                placeholder="Join Room"
              />
              <button
                // onClick={() => roomValueToNumber(inputRef.current?.value)}
                className="border p-1 rounded"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <Playground /> */}
      <button onClick={handleSignOut}>Sign Out</button>
      <ToastContainer />
    </div>
  );
}

export default App;
