let form = document.querySelector('form')
let main = document.querySelector('main')

let userArr = JSON.parse(localStorage.getItem("user"));
let isUpdatedUser;
let render = ()=>{
    
    main.innerHTML  = ""
    userArr.forEach((val)=>{
        main.innerHTML +=
     `<div class = 'user-card'>
        
<div class="img">
    <img src = '${val.imageURL}' alt = 'user'>
</div>
<h2>${val.name}</h2>
<h3>${val.email}</h3>
<div class="btn">
    <button onClick="isupdate((${val.id}))">Update</button>
<button onClick = "delt((${val.id}))">Delete</button>
</div>
    </div>`
    form.reset()
});
}
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let name = e.target[0].value
    let email = e.target[1].value
    let imageURL = e.target[2].value
    let obj = {
        id:Date.now(),
        name,
        email,
        imageURL
    }
    if(isUpdatedUser){
        let index = userArr.findIndex((val)=>val.id===isUpdatedUser )
        userArr[index] = obj;
        isUpdatedUser = null;
    }else{
    userArr.push(obj);
    }
localStorage.setItem("user", JSON.stringify(userArr));

    render()
})
function delt(id){
   let arr =  userArr.filter((val)=> val.id!==id)
   userArr = arr
localStorage.setItem("user", JSON.stringify(userArr));
   render()
}

function isupdate(id){
isUpdatedUser=id;
    let obj = userArr.find((val) => val.id === id);
    form[0].value = obj.name
    form[1].value = obj.email
    form[2].value = obj.imageURL
}


render()