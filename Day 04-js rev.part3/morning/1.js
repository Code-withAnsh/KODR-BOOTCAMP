console.log("first");

setTimeout(() => {
  console.log("in timeout 1");
}, 0);


console.log("second");

let party = new Promise((resolve, reject) => {
  setTimeout(() => {
    let isParty = true;
    if (isParty) {
      resolve("Party hogi..");
    }
    reject("No money..");
  },2000);
});
party.then((val) => console.log(val));

setTimeout(() => {
  console.log("in timeout 2");
}, 2000);

console.log("third");

console.log(party);
console.log("last");
