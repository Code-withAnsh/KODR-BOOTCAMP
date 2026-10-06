let img = document.querySelector("img")
let btn = document.querySelector("#btn")
let flag = true
// btn.addEventListener('click', ()=> {
// if(flag){
//     bulb.style.backgroundColor = "yellow";
//     btn.innerHTML = "OFF";
//     flag = false
// }
// else{
//     bulb.style.backgroundColor = "transparent"
//     btn.innerHTML = "ON"
//     flag = true
// }

    
// })

//one more way

btn.addEventListener('click',()=>{
    if(flag){
  img.setAttribute(
    "src",
    "https://images.unsplash.com/photo-1790632454757-7c0a5a0fc2ba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  );
  flag = false
}
else{
    img.setAttribute(
      "src",
      "https://plus.unsplash.com/premium_photo-1786868126588-39f864726bd9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
    );
    flag = true
}
})