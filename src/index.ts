import { fromEvent, Observable, Subject } from "rxjs";
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
*/

https: const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer: string[] = [];
const letterRows = document.getElementsByClassName("letter-row");
const userWinOrLose$ = new Subject<void>();

//generar
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];

let rightWord = getRandomWord();
console.log(rightWord);

const insertLetter = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();

    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      userAnswer.push(pressedKey);
      letterIndex++;
    }
  },
};

//observador para eliminar una letra
const deleteLetter = {
  next: (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      letterIndex--;
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];

      letterBox.textContent = "";
      letterBox.classList.remove("filled-letter");
      userAnswer.pop();
    }
  },
};

//observador para revisar si la respuesta fue correcta
// se activa cuando el jugador da Enter
const checkWord = {
  next: (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (userAnswer.join("") === rightWord) {
        userWinOrLose$.next();
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);

userWinOrLose$.subscribe(() => {
  let letterBox = Array.from(letterRows)[letterRowIndex];

  for (let index = 0; index < 5; index++) {
    letterBox.children[index].classList.add("letter-green");
  }
});
