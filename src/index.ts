import { fromEvent } from "rxjs";

const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
const letterRows = document.getElementsByClassName("letter-row");

const insertLetter = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();

    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
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
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);

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
