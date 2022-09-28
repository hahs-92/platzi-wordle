import { from, of } from "rxjs";

const fruits$ = from(["apple", "pineapple", "pear"]);
const animals$ = of("lion", "tiger", "rabbit");

fruits$.subscribe(console.log);
animals$.subscribe(console.log);
