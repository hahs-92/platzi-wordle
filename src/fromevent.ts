import { fromEvent } from "rxjs";

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
