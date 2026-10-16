// ANY UNKNOWN VOID 

// let a: number;
// a = 12; --- ab let suppose hum kisi ka type defiune hi na kare toh uska type any haui


let a;
a = 12;
a = "ansh"  // --> ab yaha dekho hum a me kuch bhi daal de rhe hai ye toh nhi karna tha hum typescript padh rhe hai
// isliye ye use na karte

// unknown-
let b : unknown;
b = 12;
b = "harsh";
// ab yaha per hum b me number aur string dono assign kuye hai but the twist is hu aage conditions laga ke
// unhe alag alag tareeke se use kr skte hai
if(typeof b === "string"){
b.toUpperCase() //ye code tbhi chalega jab b string ho
}


// void

function abcd():void{
    console.log("hey");
    // aisa fn jo kuch return na kar rha hai uska type hai void
    
}

function bcde():number{
return 12;
}

//  null --> simple null ka bheaviour aisa kiska koi value na ho ho hi na
let c:null;

//union
let d:String|null // ya toh d null ya stirng
d = "ansh";
d= null;


// never
function abce():never {       //.--> ye kuch return hi na karega
    while(true){}
    
}
abce();
console.log("hey");
