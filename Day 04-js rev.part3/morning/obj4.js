let student1 = {
  name: "Vayu",
  class: "10th",
  group: "Tagore",
  Marks: 900,
};
let student2 = {...student1,name:"varun"}//yaha per humne property  copy kar diya pura ka pura
console.log(student2);//yaha name change hoke varun ho jayega aur sari propertty value same rhega as student1
console.log(student1);

