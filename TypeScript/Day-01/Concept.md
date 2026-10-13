TypeScript is a superset of JavaScript, and TypeScript never executes. It's not a language, not a framework, not a library, not any package. It's just a superset of JavaScript. js type checking system.  
Transpier --- it converts an high level langhuage into a high or low level language let suppose you are writting a jsx code <h1>heello</h1>
now it is not directly redable it coverts into something React.create('h1;,{},"hello) and now it is in js so js now compile that js code  not that jsx and the conversion from
h1 to react.create it is transpiling and who transpel it? babel
to start write npm init -y in terminal and then npm i typescript -D this d stands for development then npx tsc --init

every code had mainly two phases compile time and run time but js ignore that compile time it directly executes runtime
now here ts comes in the game it do that compile time if it did not find any error it passed to run time
but how he do??
source code  ==> goes into lexar ==> then into parser => then in binder ==> then in checker ==> transformer ==> js executes
checker ke pass hi typescript chlta hai
