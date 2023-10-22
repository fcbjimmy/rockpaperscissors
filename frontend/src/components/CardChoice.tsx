import React from "react";

type Options = "rock" | "paper" | "scissors";

type Props = {
  option: { value: Options; image: string };
  handleChoice?: (choice: Options, id: number) => void;
  id?: number;
};

const CardChoice = ({ option, handleChoice, id }: Props) => {
  return (
    <div
      className="cursor-pointer p-2 rounded text-lg text-green-500 border border-blue-400"
      onClick={() => {
        if (typeof id === "number" && handleChoice) {
          handleChoice(option.value, id);
        } else return;
      }}
    >
      <img src={option.image} alt={option.value} />
      <span>{option.value}</span>
    </div>
  );
};

export default CardChoice;
