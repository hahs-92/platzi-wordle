import { of, mergeMap, interval, map, concatMap } from "rxjs";

const letters = of("a", "b", "c");
//mergeMap
const result = letters.pipe(
  mergeMap((x) => interval(1000).pipe(map((i) => x + i)))
);

//result.subscribe((x) => console.log(x));

//output
// a0
// b0
// c0
// a1
// b1
// c1
// a2
// b2
// c2
//....

const result2 = letters.pipe(mergeMap((x) => interval(1000)));

//output
// 0 * 3 times
// 1 * 3
// 2 * 3
// 3 * 3
// ...

result2.subscribe((x) => console.log(x));

//concatMap
const result3 = letters.pipe(
  concatMap((x) => interval(1000).pipe(map((i) => x + i)))
);

//result3.subscribe((x) => console.log(x));

// output
// a0
// a1
// a2
// a3
// a4
// a5
// a6
// ...
