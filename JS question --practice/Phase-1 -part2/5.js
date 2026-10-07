function createCallback(callback) {
    let count = 0;

    return function returnedCallback() {
        count++;
        callback(count);
    };
}

function runTwice(callback) {
    callback();
    callback();
}

const calling = createCallback((count) => {
    setTimeout(() => {
        console.log(`hello ${count}`);
    }, 2000);
});

// Returned function ko callback ke roop mein pass kiya gaya hai.
runTwice(calling);


