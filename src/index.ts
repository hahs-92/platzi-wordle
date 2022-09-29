import { fromEvent, Subject, merge } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
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
//mergeMap vs concatMap
import "./mergeMapvsConcatMap";
*/

const onKeyDown$ = fromEvent(document, "keydown");
const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.querySelector(".message-text");
const restartButton: HTMLInputElement =
  document.querySelector(".restart-button");
const userWinOrLoose$ = new Subject<void>();
let letterIndex = 0;
let letterRowIndex = 0;
let rightWord: string;
let userAnswer: string[] = [];

//generar
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];

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
      messageText.textContent =
        userAnswer.length === 4
          ? "Te falta 1 letra"
          : `Te faltan ${5 - userAnswer.length} letras¡`;
      return;
    }

    // if (!WORDS_LIST.includes(userAnswer.join(""))) {
    //   messageText.textContent = `!La palabra ${userAnswer
    //     .join("")
    //     .toUpperCase()} no esta en la lista¡`;
    //   return;
    // }

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
const onWindowLoad$ = fromEvent(window, "load");
const onRestartClick$ = fromEvent(restartButton, "click");
const restartGame = merge(onWindowLoad$, onRestartClick$);

const inserLetter$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key.toUpperCase()),
  filter(
    (pressedKey) =>
      pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && letterIndex < 5
  )
);

const checkWord$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key),
  filter((key) => key === "Enter" && letterRowIndex < 6)
);

const removeLetter$ = onKeyDown$.pipe(
  map((event: KeyboardEvent) => event.key),
  filter((key) => key === "Backspace" && letterIndex !== 0)
);

//subscriptions

userWinOrLoose$.subscribe(() => {
  let letterBox = Array.from(letterRows)[letterRowIndex];

  for (let index = 0; index < 5; index++) {
    letterBox.children[index].classList.add("letter-green");
  }
});

restartGame.subscribe(() => {
  Array.from(letterRows).map((row) =>
    Array.from(row.children).map((letterBox) => {
      letterBox.textContent = "";
      letterBox.className = "letter";
    })
  );

  letterIndex = 0;
  letterRowIndex = 0;
  messageText.textContent = "";
  userAnswer = [];

  rightWord = getRandomWord();
  console.log(rightWord);

  restartButton.disabled = true;

  let inserLetterSubscription = inserLetter$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(insertLetter);
  let checkWordSubscription = checkWord$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(checkWord);
  let removeLetterSubscription = removeLetter$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(removeLetter);
});
