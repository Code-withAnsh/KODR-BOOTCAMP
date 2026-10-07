// Create a function that accepts
//  unlimited numbers and returns their sum usingrest operator.
function sum(...numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3, 4,5,6,7,8,9)); 