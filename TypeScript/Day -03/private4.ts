// access modifier
//  public and private access modifier;
class bottleMaker{
    constructor(private name:string){
    }
    changing(): string {
        this.name = "ansh"
        return this.name;
    }
}
let b1 = new bottleMaker("hello");
// b1.name = "hululu"

let chang = b1.changing()//this will give ansh
console.log(chang);


// Ab suno, samasya yeh hai: agar hum is code ke andar `public`
//  se constructor ko declare karte hain, to maan lo hum class ke bahar 
// `b1.name = lululul` likh dete hain, to bhi wo accept ho jata hai. But agar 
// hum apne constructor ko `private` declare kar dete hain, to agar humko `name` 
// ke andar kuch bhi change karna hai, to wo class ke andar hi change karna padega, 
// chahe method bana ke karo, chahe normally karo. 
