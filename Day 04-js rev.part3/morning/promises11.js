//promises---
let pr = new Promise((res,rej)=>{
let party = true
if(!party){
res('Party hogi...')
}
rej('bhaag jao')
})
console.log(pr);
