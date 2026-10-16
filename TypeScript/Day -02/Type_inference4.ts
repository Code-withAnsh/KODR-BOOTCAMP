// type inference
// hum kuch data type na de wo khud samjh jaye its type inference
let a = "hello"

// type annotations
let c:number //0--colon maar ke kuch bhi de rhe haiu wo hai anotation


// Interfaes and Type Aliases
interface user{
name:string,
email:string,
password:string
gender?:string //ye optional ho gya de diya toh bhi theek na diya toh bhi theek
//  lekin upar ke sare feilds na diye toh error aa jayega
}
function abcd(obj:user) {
    
    
}
console.log(abcd({name:"ansh", email:"andhdh",password:"sdkjfjhdf"}))

