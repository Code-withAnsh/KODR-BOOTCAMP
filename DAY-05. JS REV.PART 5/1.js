console.log("first");
let prom = async () => {
    return 10
}
let resolve = async () => {
console.log(greet);
    let value = await prom()
    console.log(value);
}
resolve()
setTimeout(() => {
    console.log("timeout");
    
}, 1000);

console.log("second");
