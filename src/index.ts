import { fromEvent, Observable, Subject } from "rxjs";
import WORDS_LIST from "./wordsList.json";

const onKeyDown$ = fromEvent(document, "keydown");
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

/*

const numbers$ = new Observable((subscriber) => {
  //en este caso cada observer recibe un  numero diferente
  //xq el subscriber emite la funcion y en cada observer se
  //resuelve de manera diferente
  // esto se resuelve con un Subject
  subscriber.next(Math.round(Math.random() * 100));
});
//
const otherSubject$ = new Subject<number>();

const observer1 = {
  next: (number: number) => {
    console.log(number);
  },
};

const observer2 = {
  next: (number: number) => {
    console.log(number);
  },
};

// ------
//emiten valores diferentes
numbers$.subscribe(observer1);
numbers$.subscribe(observer2);

//-----------
//emite los mismo valores gracias al subject
otherSubject$.subscribe(observer1);
otherSubject$.subscribe(observer2);
numbers$.subscribe(otherSubject$); //subject puede actuar como observable and observer

//-------------
const numbersRandom$ = new Subject();

numbersRandom$.subscribe(observer1);
numbersRandom$.subscribe(observer2);

//next debe ser llamado despues de que los observers esten subscritos
numbersRandom$.next(Math.round(Math.random() * 100));
*/

/*
//fromEvent => genera un observable
const onKeyDown$ = fromEvent(document, "keydown");

//observer mouse
const observerMouse = {
  next: (event: KeyboardEvent | any) => {
    console.log("e: ", event.key);
  },
};

//subscription
onKeyDown$.subscribe(observerMouse);
*/
// __________crear un Observable _____________________
/*
const observableAlpha$ = new Observable((subscriber) => {
  subscriber.next(1);

  subscriber.next(2);
  subscriber.next(3);
  //subscriber.complete();
  //   __________deja de emitir valores_____________
  subscriber.next(4);
  //   ____________generando error__________________
  throw "ERROR GENERADO";
  subscriber.next("hola");
});

const observer = {
  next: (value: number | unknown) => {
    console.log(value);
  },
  complete: () => {
    console.log("Observable completed");
  },
  error: (err: string) => {
    console.error("Error: ", err);
  },
};

observableAlpha$.subscribe(observer);
*/
