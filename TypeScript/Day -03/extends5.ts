class bottleMaker{
    constructor(public name:string){

    }
    
}
class metalBotleMaker extends bottleMaker {
    constructor(name:string){
        super(name);
    }
    getvalue():string{
       return this.name;
        
    }
}
let b1 = new metalBotleMaker("milton")
console.log(b1.getvalue())