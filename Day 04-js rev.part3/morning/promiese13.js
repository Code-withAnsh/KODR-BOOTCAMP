//promise handler

let party = new Promise((res,rej)=>{
let isparty = true
if(isparty){
res('Party hogi...')
}
rej('bhaag jao')
})

party.then((val)=>{
console.log("hllo");

})