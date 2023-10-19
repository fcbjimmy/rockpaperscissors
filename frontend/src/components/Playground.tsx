import { useEffect, useState } from "react";
import UserChoice from "./UserChoice";
import { socket } from "../App";
import paper from "/images/paper.png";
import rock from "/images/stone.png";
import scissors from "/images/scissors.png";

type Options = "rock" | "paper" | "scissors";
type ReceivedData = {
  name: "";
  email: "";
  choice: Options;
};
const Playground = () => {
  const [selectedChoice, setSelectedChoice] = useState<null | Options>(null);
  const [choiceId, setChoiceId] = useState<null | number>(null);
  const [opponentData, setOpponentData] = useState<null | ReceivedData>(null);

  let resultTimeout: NodeJS.Timeout | undefined;

  useEffect(() => {
    socket.on("receivedChoice", (data: ReceivedData) => {
      console.log(data);
      setOpponentData(data);
    });

    return () => {
      socket.off("receivedChoice", (data) => {});
    };
  }, [socket]);

  useEffect(() => {
    socket.on("gameResult", (winner) => {
      resultTimeout = setTimeout(() => {
        if (winner === "draw") {
          console.log("Its a Draw");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
        } else if (socket.id === winner) {
          console.log("Winner", winner);
          console.log("You Win");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
        } else {
          console.log("Looser", socket.id);
          console.log("You Loose");
          setSelectedChoice(null);
          setOpponentData(null);
          setChoiceId(null);
        }
      }, 2000);
      return () => {
        if (resultTimeout) {
          clearTimeout(resultTimeout);
        }
      };
    });
  }, [socket]);

  return (
    <section>
      <div className="flex justify-center gap-10">
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
        {opponentData ? (
          <div>
            <h1>{opponentData.name}'s choice</h1>
            <div className="cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400">
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
      </div>
      <UserChoice
        selectedChoice={selectedChoice}
        setSelectedChoice={setSelectedChoice}
        choiceId={choiceId}
        setChoiceId={setChoiceId}
      />
    </section>
  );
};

export default Playground;
