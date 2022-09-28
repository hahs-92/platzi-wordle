import { Subject, Observable } from "rxjs";

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
