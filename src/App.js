//CSS
import "./App.css";
// React
import { useCallback, useEffect, useState } from "react";

import { wordsList } from "./data/words";

import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
const guessesQty = 5; // Move this line to the top
const stages = [
  {
    id: 1,
    name: "start",
  },
  {
    id: 2,
    name: "game",
  },
  {
    id: 3,
    name: "end",
  },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  //palavra
  const [pickedWord, setPickedWord] = useState("");

  //categoria
  const [pickedCategory, setPickedCategory] = useState("");

  //letras da categoria
  const [letters, setLetters] = useState([]);

  //letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);

  //letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);

  //chances
  const [guesses, setGuesses] = useState(guessesQty);



  //pontuação
  const [score, setScore] = useState(50);
  console.log(letters);
  const pickWordAndCategory = useCallback(() => {
    //pega as categorias
    const categories = Object.keys(words);

    //faz pegar uma categoria aleatória dentro de todas categorias.
    //objectKeys pega as categorias(keys) e Math.floor arredonda o número pra baixo.
    //Math.random da um número quebrado por isso tem que usar o floor.
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pegando aleatoriamente uma palavra da categoria -> (category)
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //starts the secret word game
  const startGame = useCallback(() => {
    //limpando os campos caso seja acertado ou errado a palavra
    clearLetterStates();

    //pick word and pick category
    const { word, category } = pickWordAndCategory();

    console.log(category, word);

    //create an array of letters
    //pegando a palavra e separando cada letra
    let wordLetters = word.split("");

    //transformando cada letra em minuscula
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    //padronizando a letra como minúscula que o usuário digita
    const normalizedLetter = letter.toLowerCase();

    //checando se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //incluindo as letras acertadas ou erradas no array
    if (letters.includes(normalizedLetter)) {
      //incluindo letras acertadas em guessedLetters
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      //incluindo letras erradas em wrongLetters
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //monitora se as tentativas terminaram
  useEffect(() => {
    //monitorando se a chance fica menor ou igual a 0
    if (guesses <= 0) {
      //resetando todos os estados
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //monitora se ganhou
  useEffect(() => {

    //retira as letras repetidas e forma um novo array sem letras repetidas
    const uniqueLetters = [...new Set(letters)];

    //condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      //adicionando score
      setScore((actualScore) => (actualScore += 100));

      //reiniciar para uma nova palavra nova
      startGame();
      setGuesses(guessesQty);
    }
    console.log(uniqueLetters);

  }, [guessedLetters, letters, startGame]);

  //restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
