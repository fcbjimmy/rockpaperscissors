import { useEffect, useState } from "react";
import UserChoice from "./UserChoice";
import { socket } from "../utils/socketIo";
import paper from "/images/paper.png";
import rock from "/images/stone.png";
import scissors from "/images/scissors.png";
import { auth } from "../../firebase-config";
import io from "socket.io-client";

type Options = "rock" | "paper" | "scissors";
type ReceivedData = {
  name: "";
  email: "";
  choice: Options;
};

type Props = {
  room: string;
};

const Playground = ({ room }: Props) => {
  const [selectedChoice, setSelectedChoice] = useState<null | Options>(null);
  const [choiceId, setChoiceId] = useState<null | number>(null);
  const [opponentData, setOpponentData] = useState<null | ReceivedData>(null);
  const [showAllPlayersChoices, setShowAllPlayersChoices] =
    useState<boolean>(false);
  // const [players, setPlayers] = useState<null | [string, string][]>([]);
  let resultTimeout: NodeJS.Timeout | undefined;

  useEffect(() => {
    socket.on("message", (data: { [key: string]: string }) => {
      console.log("data from the server");
      console.log(data);
    });
    return () => {
      socket.off("message", () => {});
    };
  }, []);

  //Receiving signal of the players who are online
  // useEffect(() => {
  //   socket.on("onlineUsers", (user) => {
  //     console.log("My ID", socket.id);
  //     console.log(user);
  //   });
  //   //clean up ✅
  //   return () => {
  //     socket.off("onlineUsers", () => {});
  //   };
  // }, []);

  //Receiving opponent choice (Need to make it so that it receives more than one choice)
  useEffect(() => {
    socket.on("receivedChoice", (data: ReceivedData) => {
      console.log("receivedChoice");
      console.log(data);
      setOpponentData(data);
    });

    //clean up ✅
    return () => {
      socket.off("receivedChoice", () => {});
    };
  }, []);

  //Receiving game result and resetting the game
  useEffect(() => {
    socket.on("gameResult", (winner) => {
      setShowAllPlayersChoices(true);
      resultTimeout = setTimeout(() => {
        if (winner === "draw") {
          console.log("Its a Draw");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
          setShowAllPlayersChoices(false);
        } else if (socket.id === winner) {
          console.log("Winner", winner);
          console.log("You Win");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
          setShowAllPlayersChoices(false);
        } else {
          console.log("Looser", socket.id);
          console.log("You Loose");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
          setShowAllPlayersChoices(false);
        }
      }, 2000);
    });

    //clean up the timeout and socket✅
    return () => {
      if (resultTimeout) {
        clearTimeout(resultTimeout);
      }
      socket.off("gameResult", () => {});
    };
  }, []);

  return (
    <section>
      <div
        className={`flex ${
          selectedChoice && typeof choiceId === "number" ? "" : "flex-col"
        } justify-center gap-10`}
      >
        {/* {selectedChoice ? (
          <div>
            <h1>My Choice</h1>
            <div className="cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400">
              <img
                src={
                  selectedChoice === "paper"
                    ? paper
                    : selectedChoice === "scissors"
                    ? scissors
                    : selectedChoice === "rock"
                    ? rock
                    : ""
                }
                alt={selectedChoice}
              />
            </div>
          </div>
        ) : (
          <></>
        )} */}
        {showAllPlayersChoices && opponentData ? (
          <div>
            <h1>{opponentData.name}'s choice</h1>
            <div className="cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400 w-max">
              <img
                src={
                  opponentData.choice === "paper"
                    ? paper
                    : opponentData.choice === "scissors"
                    ? scissors
                    : opponentData.choice === "rock"
                    ? rock
                    : ""
                }
                alt={opponentData.choice}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        <UserChoice
          selectedChoice={selectedChoice}
          setSelectedChoice={setSelectedChoice}
          choiceId={choiceId}
          setChoiceId={setChoiceId}
          room={room}
        />
      </div>
    </section>
  );
};

export default Playground;
