let imgs = [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Ravi_Kissen_at_the_launch_of_T_P_Aggarwal%27s_trade_magazine_%27Blockbuster%27_20.jpg/330px-Ravi_Kissen_at_the_launch_of_T_P_Aggarwal%27s_trade_magazine_%27Blockbuster%27_20.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Meeting_with_Masayoshi_Son_and_Sam_Altman_%28February_3%2C_2025%29_%283x4_cropped_on_Altman%29.jpg/330px-Meeting_with_Masayoshi_Son_and_Sam_Altman_%28February_3%2C_2025%29_%283x4_cropped_on_Altman%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/330px-Mahatma-Gandhi%2C_studio%2C_1931.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/330px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Nathuram_godse.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Yogiji_in_2023.jpg/330px-Yogiji_in_2023.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/330px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg"
];
let main = document.querySelector('main')
let btn = document.querySelector('#btn')
let box = document.querySelector('.box')
let time = document.querySelector('#time')
let score = document.querySelector("#score")
let reset = document.querySelector("#reset")
let count = 0
let scoreCount = 0;
btn.addEventListener('click',()=>{
  
   let interval = setInterval(() => {
       count++
       time.textContent = count
       let randomImgs = Math.floor(Math.random()*imgs.length)
    box.style.backgroundImage = `url(${imgs[randomImgs]})`

    let rt = Math.floor(Math.random()*85)
    let rl = Math.floor(Math.random()*85)
console.log(rt);

    box.style.top = `${rt}%`
    box.style.left = `${rl}%`
    btn.disabled = true

    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
    
    // if (count == 10) {
    //   alert("Game Over!");
    //   return
    // }

})
  box.addEventListener('click',()=>{
    if (count === 10) {
      alert("Game Over!");
      return
    }else {
         let audio = new Audio(
           "./assets/maka-bhosda-aag-meme-amitabh-bachan-made-with-voicemod_TCnNR6UJ.mp3",
         );
         audio.play();
    scoreCount++
    score.textContent = scoreCount
    //adding sound effect when box is clicked
 
    }
  })
  reset.addEventListener('click',()=>{
    count = 0
    scoreCount = 0
    time.textContent = count
    score.textContent = scoreCount
    btn.disabled = false
  })