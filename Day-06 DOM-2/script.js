
let form = document.querySelector('form');
let main = document.querySelector('main')
userArr = [];
let isUpdatedUser;
let render = ()=>{
    main.innerHTML = "";
       userArr.forEach((val) => {
         main.innerHTML += `<div class = 'user-card'>
        
<div class="img">
    <img src = '${val.imageURL}' alt = 'user'>
</div>
<h2>${val.name}</h2>
<h3>${val.email}</h3>
<div class="btn">
    <button onClick = "userUpdate((${val.id}))">Update</button>
<button onClick="delUser((${val.id}))" id = 'dlt'>Delete</button>
</div>

    </div>`;
         form.reset();

       }); 
}
form.addEventListener('submit',(e)=>{
    
    e.preventDefault()
let name = e.target[0].value;
let email = e.target[1].value;
let imageURL = e.target[2].value;

if(name.trim() === '' || email.trim()==='' || imageURL.trim()===''){
    alert('please enter the values')
    return
}
    let obj = {
        id:Date.now(),
      name,
      email,
      imageURL,

    };
if(isUpdatedUser){
let index = userArr.findIndex((val)=> val.id === isUpdatedUser)
userArr[index] = obj;
isUpdatedUser = null;
}else{
    userArr.push(obj); 

}
    
render()
   
    })
let delUser = (id)=>{
    let arr = userArr.filter((val)=>val.id!==id)
    userArr = arr
    render()
}

let userUpdate = (id)=>{
    isUpdatedUser = id;
    let userObj = userArr.find((val) => val.id === id);
    form[0].value = userObj.name;
    form[1].value = userObj.email;
    form[2].value = userObj.imageURL;
}