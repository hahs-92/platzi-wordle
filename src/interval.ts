import { interval, timer } from "rxjs";

const sequenceNumbers$ = interval(2000);
const delayTimer$ = timer(5000);

sequenceNumbers$.subscribe(console.log); // imprime un numero cada 2segundos
delayTimer$.subscribe(console.log); // imprime un valor despues de 5segundos
