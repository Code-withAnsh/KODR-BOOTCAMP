// let h1 = document.querySelector('h1')
// let rh1 = React.createElement('h1',{},"hello i am from react") //it accepts id, props and children
// console.log("asli h1 ==>:",h1);
// console.log("nakli react ka h1 ==>",rh1);

// const { createElement } = require("react");

// document.body.append(h1)//ye toh append hop jayega
// // document.body.append(rh1)//ye append na hoga
// //but if u want to render it toh root create karke karo
// ReactDOM.createRoot(document.getElementById("root")).render(rh1)



// let h1 = document.createElement("h1");
// h1.textContent = "hello i am original";
// let div = React.createElement("div",{id:"root",width:"800"},[
//     React.createElement("h1",{},"hello"),
//     React.createElement("p",{},"lorem pisum dolar jkbfjk"),
//     React.createElement("button",{},'create')
// ])
// ReactDOM.createRoot(document.getElementById("root")).render(div)




// let section1 = React.createElement("section",{},[
//     React.createElement('h1',{},"Heading 1"),
//     React.createElement('p',{},"lorem epsum dolor sit amet.")
// ])
// ReactDOM.createRoot(document.getElementById("root")).render(section1)

let main = React.createElement('main',{},React.createElement('div',{},React.createElement('header',{},[
    React.createElement('h1',{},"Heading hu mai"),
    React.createElement('p',{},"Links")

],
React.createElement('div',{},React.createElement('section',{},[
    React.createElement('h1',{},"heading1"),
    React.createElement('p',{},"lorem epsum ")
]))

)))
 ReactDOM.createRoot(document.getElementById("root")).render(main)

