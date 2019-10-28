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
        newLi.innerHTML = this.format(times); //+'&nbsp &nbsp &nbsp'+msg;
        let list = document.querySelector('ol');
        list.appendChild(newLi);
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
    bestOl.addEventListener('DOMNodeInserted', bestScore, false);
    function bestScore(){
        var best = document.querySelector('a.best');
        var valueLi = document.querySelectorAll('li');
        var minValue = Math.min(valueLi);
        best.textContent = minValue;
        //best.innerText = stopwatch.format(stopwatch.times);
    }