import { useState, useEffect } from "react";
import paperImg from "/images/paper.png";
import stoneImg from "/images/stone.png";
import scissorsImg from "/images/scissors.png";
import { socket } from "../App";
import { auth } from "../../firebase-config";
import CardChoice from "./CardChoice";

type Options = "rock" | "paper" | "scissors";

type Props = {
  selectedChoice: null | Options;
  setSelectedChoice: React.Dispatch<React.SetStateAction<Options | null>>;
  choiceId: null | number;
  setChoiceId: React.Dispatch<React.SetStateAction<number | null>>;
};

const UserChoice = ({
  selectedChoice,
  setSelectedChoice,
  setChoiceId,
  choiceId,
}: Props) => {
  //options
  const options: { value: Options; image: string }[] = [
    { value: "rock", image: stoneImg },
    { value: "paper", image: paperImg },
    { value: "scissors", image: scissorsImg },
  ];
  //function
  const handleChoice = (choice: Options, id: number) => {
    setSelectedChoice(choice);
    setChoiceId(id);
    console.log("ID", socket.id);
    socket.emit("sendChoice", {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      choice,
    });
  };

  return (
    <div>
      <h1>Choose your option:</h1>
      {selectedChoice && choiceId ? (
        <div className="flex justify-center">
          <CardChoice option={options[choiceId]} />
        </div>
      ) : (
        <div className="flex">
          {options.map((option, id) => {
            return (
              <CardChoice
                option={option}
                key={id}
                id={id}
                handleChoice={handleChoice}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserChoice;

// <div
// onClick={() => handleChoice("rock")}
// className={`cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400 ${
//   selectedChoice === "rock"
//     ? "border border-green-300 text-black"
//     : ""
// }`}
// >
// <img src={stoneImg} alt="rock" />
// <span>Rock</span>
// </div>
// <div
// className={`cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400 ${
//   selectedChoice === "paper"
//     ? "border border-green-300 text-black"
//     : ""
// }`}
// onClick={() => handleChoice("paper")}
// >
// <img src={paperImg} alt="paper" />
// <div>Paper</div>
// </div>
// <div
// className={`cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400 ${
//   selectedChoice === "scissors"
//     ? "border border-green-300 text-black"
//     : ""
// }`}
// onClick={() => handleChoice("scissors")}
// >
// <img src={scissorsImg} alt="scissors" />
// <div>Scissors</div>
// </div>
