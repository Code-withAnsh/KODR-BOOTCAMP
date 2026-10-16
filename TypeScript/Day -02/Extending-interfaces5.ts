interface user{
    name:string,
    email:string,
    password:string,
}
interface Admin extends user{
    admin:boolean //user me jo jo hoga wo toh admin me hoga saath me uske pass ek extra property hai admin
}
function abcd(obj:Admin) { //user+Admin

 return obj.name;   
}

console.log( abcd({name:"ansh",email:'ajhdsbfhjd',password:"adkjbfk",admin:true}))