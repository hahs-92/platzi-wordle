import { filter, fromEvent, map, Observable, Subject, takeUntil } from "rxjs";
import WORDS_LIST from "./wordsList.json";

// __________ejemplos____________
//observable
/*
import "./observable";
//fromEvent
import "./fromevent"
//subject vs observable
import "./subject";
//of and from
import "./fromandof";
//interval and timer
import "./interval";
*/

const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer: string[] = [];
const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.querySelector(".message-text");
const restartButton: HTMLInputElement =
  document.querySelector(".restart-button");
const userWinOrLoose$ = new Subject<void>();

//generar
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];

let rightWord = getRandomWord();
console.log(rightWord);

//observers
const insertLetter = {
  next: (letter: string) => {
    let letterBox =
      Array.from(letterRows)[letterRowIndex].children[letterIndex];

    letterBox.textContent = letter;
    letterBox.classList.add("filled-letter");
    letterIndex++;
    userAnswer.push(letter);
  },
};

//observador para eliminar una letra
const removeLetter = {
  next: () => {
    let letterBox = letterRows[letterRowIndex].children[userAnswer.length - 1];
    letterBox.textContent = "";
    letterBox.classList.add("letter");
    letterIndex--;
    userAnswer.pop();
  },
};

//observador para revisar si la respuesta fue correcta
// se activa cuando el jugador da Enter
const checkWord = {
  next: () => {
    if (userAnswer.length < 5) {
      messageText.textContent = "¡Te faltan algunas letras!";
      return;
    }

    // También podemos cambiar el ciclo for/forEach/while en lugar de `userAnswer.map()`
    // Iteramos sobre las letras en índices `[0, 1, 2, 3, 4]`:
    userAnswer.map((_, i) => {
      let letterColor = "";
      let letterBox = letterRows[letterRowIndex].children[i];

      let letterPosition = rightWord.indexOf(userAnswer[i]);

      if (rightWord[i] === userAnswer[i]) {
        letterColor = "letter-green";
      } else {
        if (letterPosition === -1) {
          letterColor = "letter-grey";
        } else {
          letterColor = "letter-yellow";
        }
      }
      letterBox.classList.add(letterColor);
    });

    // if (userAnswer.length === 5) {
    //   letterIndex = 0;
    //   userAnswer = [];
    //   letterRowIndex++;
    // }

    if (userAnswer.join("") === rightWord) {
      messageText.textContent = `😊 ¡Sí! La palabra ${rightWord.toUpperCase()} es la correcta`;
      userWinOrLoose$.next();
      restartButton.disabled = false;
    } else {
      letterIndex = 0;
      letterRowIndex++;
      userAnswer = [];

      if (letterRowIndex === 6) {
        messageText.textContent = `😔 Perdiste. La palabra correcta era: "${rightWord.toUpperCase()}"`;
        userWinOrLoose$.next();
        restartButton.disabled = false;
      }
    }
  },
};

//observables
const inserLetter$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key.toUpperCase()),
  filter(
    (pressedKey) =>
      pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && letterIndex < 5
  )
);

const checkWord$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key),
  filter((key) => key === "Enter" && letterIndex === 5 && letterRowIndex <= 5)
);

const removeLetter$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key),
  filter((key) => key === "Backspace" && letterIndex !== 0)
);

//subscriptions

// onKeyDown$.subscribe(insertLetter);
// onKeyDown$.subscribe(removeLetter);
// onKeyDown$.subscribe(checkWord);

userWinOrLoose$.subscribe(() => {
  let letterBox = Array.from(letterRows)[letterRowIndex];

  for (let index = 0; index < 5; index++) {
    letterBox.children[index].classList.add("letter-green");
  }
});

inserLetter$.pipe(takeUntil(userWinOrLoose$)).subscribe(insertLetter);
checkWord$.pipe(takeUntil(userWinOrLoose$)).subscribe(checkWord);
removeLetter$.pipe(takeUntil(userWinOrLoose$)).subscribe(removeLetter);
