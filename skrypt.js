console.log("dupa 26.04.2020");
class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.laps = [];
        this.reset();
        this.print(this.times);
    }
    reset() {
        this.times = [ 0, 0, 0 ];
    }
    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    lap() {
        let times = this.times;
        let newLi = document.createElement('li');
        let msg = document.querySelector('h1').textContent;
        newLi.innerHTML = (arrayScore.length+1)+'.&nbsp &nbsp'+this.format(times)+'&nbsp &nbsp &nbsp'+msg;
        let list = document.querySelector('ol');
        list.insertBefore(newLi, list.firstChild);
    }
    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    clear() {
        clearChildren(this.results);
    }
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    print() {
        this.display.innerText = this.format(this.times);
    }
    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
    }
}


function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.results'));
    // var przycisk = document.querySelector('.button');
    // przycisk.addEventListener('keydown', function(event){
    //     switch (event.keyCode){
    //         case 32:
    //         buttonControls();
    //         this.alert("spacja");
    //         break;
    //     }
    // })
    var a = document.querySelector('.button');
    document.addEventListener('keypress', function(e){
        buttonControls();
    }, false);
    a.addEventListener('click', buttonControls, false);
    // function checkKeycode(e){
    //     var keycode;
    //     if(window.event)
    //     {keycode = window.event.keyCode;
    //     }else if (e){
    //         keycode = e.which;
    //     }
    //         var przycisk = document.querySelector('a');
    //         przycisk.addEventListener('onkeydown', function(e){
    //             buttonControls();
    //         }, false);
    //         alert("keycode: " + keycode);
    //     }

    function buttonControls(e){
        if(!e){
            e = window.event;
        }
        var a = document.querySelector('.button');
        target = a;
        //target = e.target || srcElement;
        if(event.preventDefault){
            e.preventDefault();
        }else{
            event.returnValue = false;
        }
        switch(target.getAttribute('data-state')){
            case 'start':
                start(target);
                break;
            case 'stop':
                stop(target);
                break;
            case 'reset':
                reset(target);
                break;
        }
    }
    function start(target){
        stopwatch.restart();
        target.setAttribute('data-state', 'stop');
        target.textContent = 'STOP!';
    }
    function stop(target){
        target.setAttribute('data-state', 'start');
        target.textContent = 'GO!';
        stopwatch.stop();
        stopwatch.lap();
        scrambleRubiksCube();
    }
    // function reset(target){
    //     stopwatch.reset();
    //     target.setAttribute('data-state', 'start');
    //     target.textContent = 'start';
    // }

    function scrambleRubiksCube(){
        // moveTab - tablica ruchów
        // const moveTab = new Array("U'","U", "U2", "R", "R'", "R2", "D", "D'", "D2", "L", "L'", "L2", "B", "B'", "B2");
        let moveTab = ['U', 'D', 'R', 'L', 'F', 'B'];
        let scramble = [];
        //scramble[0] = Math.ceil(Math.random()*14);
        var msg = '';
        for(i=0; i<20; i++){
                scramble[i] = Math.floor(Math.random()*4);
                var bufor = moveTab[scramble[i]];
                moveTab.splice(scramble[i], 1);
                var buforTwo;
                primeAndTwo(buforTwo);
                msg += buforTwo+' ';
                moveTab.push(bufor);
        }
        function primeAndTwo(){
            var drawPrime = Math.floor(Math.random()*10);
            if(drawPrime < 2){
                buforTwo = bufor+"' ";
                buforTwo.toString();
            }else if(drawPrime > 8){
                buforTwo = bufor+'2 ';
                buforTwo.toString();
            }else{
                buforTwo = bufor;
                return buforTwo;
            }
        }
        document.querySelector('h1').textContent = msg;
    }
    var bestOl = document.querySelector('ol');
    bestOl.addEventListener('DOMNodeInserted', function(){
        bestScore();
        worstScore();
        counterScore();
        avgScore();
    }, false);
    let arrayScore = [];
    let arrayScoreAvg = [0, 0, 0, 0, 0, 0, 0];
    var sum = 0;
    function bestScore(){
        var timeToArray = stopwatch.format(stopwatch.times);
        arrayScore.push(timeToArray);
        arrayScore.sort();
        var best = document.querySelector('a.best');
        best.classList.add('move');
        best.innerText = 'Best: '+arrayScore[0];
    }
    function worstScore(){
        var worst = document.querySelector('a.worst');
        worst.classList.add('move');
        worst.innerText = 'Worst: '+arrayScore[arrayScore.length-1];
    }
    function counterScore(){
        var counterLength = arrayScore.length;
        var counter = document.querySelector('a.counter');
        counter.classList.add('move');
        counter.innerText = 'Counter: '+counterLength;
    }
    function avgScore(){
        var timeString = stopwatch.format(stopwatch.times).split(':');
        let oneTime = timeString[0];
        let twoTime = timeString[1];
        let threeTime = timeString[2];
        var timeNumber = oneTime + twoTime + threeTime;
        sum = sum + parseInt(timeNumber);
        //let avgSum = [...Math.ceil(sum / arrayScore.length)];
        let avgSum = (Math.ceil(sum / arrayScore.length)).toString().split("").reverse();
        for(i=avgSum.length; i<7; i++){
            avgSum[i] = 0;
        }
        var colonSum = ':';
        
        arrayScoreAvg[5] = colonSum;
        arrayScoreAvg[2] = colonSum;
        arrayScoreAvg[0] = avgSum[0];
        arrayScoreAvg[1] = avgSum[1];
        arrayScoreAvg[3] = avgSum[2];
        arrayScoreAvg[4] = avgSum[3];
        arrayScoreAvg[6] = avgSum[4];
        arrayScoreAvg[7] = avgSum[5];

        var arrayScoreAvgEnd = arrayScoreAvg.reverse().join('');
        var avg = document.querySelector('a.avg');
        avg.classList.add('move');
        avg.innerText = 'Average: '+arrayScoreAvgEnd;
    }
