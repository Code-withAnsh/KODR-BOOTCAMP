console.log("first");
setTimeout(() => {
    console.log('in timeout 1');
    
}, 0);
console.log("second");

setTimeout(() => {
    console.log("in timeout 2");
    
}, 2000);

console.log("third");

let pr = new Promise((res, rej) => {
  let party = true;
  if (party) {
    res("Party hogi...");
  }
  rej("bhaag jao");
});

// async promise handlers hai promises nhi handler yaani .then .cathc ye sab aur wo use hi na kiya toh ye promises bhi synchroomous behanve karega
console.log(pr);

console.log("last");

