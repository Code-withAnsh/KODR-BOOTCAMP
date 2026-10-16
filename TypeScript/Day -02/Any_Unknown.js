"use strict";
// ANY UNKNOWN VOID 
Object.defineProperty(exports, "__esModule", { value: true });
// let a: number;
// a = 12; --- ab let suppose hum kisi ka type defiune hi na kare toh uska type any haui
let a;
a = 12;
a = "ansh"; // --> ab yaha dekho hum a me kuch bhi daal de rhe hai ye toh nhi karna tha hum typescript padh rhe hai
// isliye ye use na karte
// unknown-
let b;
b = 12;
b = "harsh";
// ab yaha per hum b me number aur string dono assign kuye hai but the twist is hu aage conditions laga ke
// unhe alag alag tareeke se use kr skte hai
if (typeof a === "string") {
}
//# sourceMappingURL=Any_Unknown.js.map