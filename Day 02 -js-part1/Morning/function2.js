//1.function expression
let summ = function () {};
//2.function statement
function sum() {
  //ye hi sirf window me jayega baaki sab me variables hai kahi na kahi
}
//3.anonymous fn
// function(){

// }

es6;
//arrow fn
let fn = () => {};
//implicit return

 let summm = (a, b) => {
   // ye code run hone se pehle memory phase mein 'summm' TDZ mein hota hai
   // (undefined nahi) — jab tak is line (assignment) execute nahi ho jati
   // "let summm = ..." execute hote hi TDZ khatam, summm ko function value mil jati hai
   // phir jab line 26 pe summm(45, 90) call hota hai, wahi function invoke hota hai
   // a=45, b=90 milte hain, return hoke value wapas line 26 pe chali jaati hai
   return a + b;
 };
 
 summm(45, 90);

let add = (a, b) => {
  console.log(a + b);
};
let ans = add(30, 40);
console.log(ans);
// yaha  add aur ans ko browser ne undefined kar diya



sum();
var sum = () => {
  console.log(30 + 40);
};


sum();
function sum() {
  console.log(45 + 30);
}

sum();
let sum = () => {
  console.log(30 + 40);
};
///studey rest 


let a = 5;
let b= 6;
console.log(a);
console.log(b);

let aa;
console.log(aa) 

