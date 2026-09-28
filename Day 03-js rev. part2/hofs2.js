// //higher order function
// let outer = ()=>{
//     // return 10; but if we return a function
//     return  ()=>{
//         console.log('hello');
        
//     }
// }
// let ans = outer()
// console.log(ans);


// let outer = (param)=>{

//    return param
// }
// let ans = outer(10)
// console.log(ans);


let outer = (param)=>{

   return param
}
let ans = outer(()=>{
    
})
console.log(ans);
