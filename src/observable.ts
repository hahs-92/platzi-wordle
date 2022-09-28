import { Observable } from "rxjs";
// __________crear un Observable _____________________

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
