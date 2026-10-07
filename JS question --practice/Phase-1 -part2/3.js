// Write a function that counts vowels in a string
function countVowel(str) {
    let vowels = "aeiou"
    let count = 0
    let i =0
    while(i<str.length){
        if(str.includes(vowels[i])){
        
            count++
           
        }
         i++;
    }
    return count
}
console.log(countVowel("hello"));
