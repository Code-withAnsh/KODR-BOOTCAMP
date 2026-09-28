// Make an infinite-sum currying function.
let sum = (a) => {
  if (a === undefined) return 0;

  return (b) => {
    if (b === undefined) return a;
    return sum(a + b);
  };
};

let ans = sum(1)(2)(3)(4)();
console.log(ans);
