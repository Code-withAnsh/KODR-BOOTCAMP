let student1={
    name:"Vayu",
    class:"10th",
    group:"Tagore",
    Marks:900,
}
let student2 = student1//yaha pr hum studfen2 me student1 ka adress pass karte hai na kii actual value
//agar student2 me kuch bhi change karenge yaani adress change kiye toh adrrss studnent1 ke liye bhi badal jayega
student2.name = "varun"
console.log(student2);
console.log(student1);

let a =90;
let b=a;//yaha actual value copy hoti hai
console.log(a);//90
console.log(b);//90
b = 89;
console.log(a);//90
console.log(b);//89







// let student2 = {
//   name: "Student2",
//   class: "10th",
//   group: "Shivaji",
//   Marks: 1000,
// };
// console.log(student2);
