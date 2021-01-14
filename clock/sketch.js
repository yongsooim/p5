let osc, playing, freq, amp, oscLong
let jazz, isJazzReady = false
let foreground
let direction = 'left'
let tick = 0
let transitionDone = false;
const tickMax = 13
const tickMaxSquare = tickMax * tickMax 
var offset = new Date().getTimezoneOffset();
var gmt = -offset/60;
var clockPosX, clockPosY
var gmtString = (gmt >= 0) ? 'GMT+'+gmt : 'GMT'+gmt;


function setup() {
  getAudioContext().suspend();

  createCanvas(windowWidth, windowHeight)
  foreground = createGraphics(windowWidth, windowHeight);

  textFont('Helvetica', 100, 100)
  textStyle(BOLD)
  foreground.textFont('Helvetica', 100, 100)
  foreground.textStyle(BOLD)

  osc = new p5.Oscillator('sine')
  oscLong = new p5.Oscillator('sine')

  oscLong.freq(1000)
  osc.freq(2000)
  osc.amp(0.12)

  jazz = loadSound('assets/jazz.mp3', jazzReady);

  colorMode(HSB, 360, 100, 100)
  foreground.colorMode(HSB, 360, 100, 100)
  clockPosX = windowWidth / 2
  clockPosY = (windowHeight / 2) - 50

}

var sOld = 0
var clieckEvent = 0
var randomColor = [360 * Math.random() , 55 + 10 * Math.random(), 75 + 10 * Math.random()]; // HSB
var nextRandomColor = [360 * Math.random() , 55 + 10 * Math.random(), 75 + 10 * Math.random()]; // HSB

function draw() {

  let s = second()
  
  if(tick < tickMax){
    tick++
  }

  if(s != sOld){ /* once a second */
    if(clieckEvent == 1 && jazz.isPlaying() == false){
      jazz.play()
      clieckEvent = 0
    }

    tick = 0
    transitionDone = false
    osc.start();
    osc.stop(0.02);

    if(s % 10 == 0){
      oscLong.amp(0.15)
      oscLong.start();
      oscLong.amp(0, 1.8)
    }

    if(s % 2 == 0){
      nextRandomColor = [360 * Math.random() , 55 + 10 * Math.random(), 75 + 10 * Math.random()];
    }

    switch(direction){
      case 'left':
        direction = 'up'
        break;
  
      case 'up' :
        direction = 'right'
        break;
  
      case 'right' :
        direction = 'down'
        break;
  
      case 'down' : 
        direction = 'left'
        break;
     }
  }


  if(transitionDone == false){
    if(s % 2 == 0){
      background('white')
      fill(randomColor[0] , randomColor[1], randomColor[2])
    } else{
      background(randomColor[0] , randomColor[1], randomColor[2])
      fill('white')
    }

  } else {
    if(s % 2 == 0){ 
      background(randomColor[0] , randomColor[1], randomColor[2])
      fill('white')
  
    } else {
      background('white')
      fill(randomColor[0] , randomColor[1], randomColor[2])
  
    }

  }

  textFont('Helvetica', 100, 100)
  text(hour().toString().padStart(2,'0'), clockPosX - 130, clockPosY)
  text(minute().toString().padStart(2,'0'), clockPosX, clockPosY)
  text(s.toString().padStart(2,'0'), clockPosX + 130, clockPosY)


  textFont('Helvetica', 30, 30)
  text(gmtString, clockPosX+10, clockPosY + 40);

  textFont('Helvetica', 20, 20)
  if(jazz.isPlaying() == true){
    text('playing', clockPosX + 25, clockPosY + 80)
  } else if(isJazzReady == true){
    text('click to play', clockPosX, clockPosY + 80)
  } else {
    text('loading, please wait', clockPosX - 30, clockPosY + 80)
  }

  if (tick >= tickMax) {
    randomColor = nextRandomColor;
    transitionDone = true;
  }

  if(s % 2 == 0){
    foreground.background(nextRandomColor[0] , nextRandomColor[1], nextRandomColor[2])

  } else {
    foreground.background('white')

  }


  foreground.textFont('Helvetica', 30, 30)
  foreground.text(gmtString, clockPosX+10, clockPosY + 40);

  foreground.textFont('Helvetica', 20, 20)
  if(jazz.isPlaying() == true){
    foreground.text('playing', clockPosX + 25, clockPosY + 80)
  } else if(isJazzReady == true){
    foreground.text('click to play', clockPosX, clockPosY + 80)
  } else {
    foreground.text('loading, please wait', clockPosX - 30, clockPosY + 80)
  }


  if(s % 2 == 0){
    foreground.fill('white')
  } else {
    foreground.fill(nextRandomColor[0] , nextRandomColor[1], nextRandomColor[2])
  }

  foreground.textFont('Helvetica', 100, 100)
  foreground.text(hour().toString().padStart(2,'0'), clockPosX - 130, clockPosY)
  foreground.text(minute().toString().padStart(2,'0'), clockPosX, clockPosY)
  foreground.text(s.toString().padStart(2,'0'), clockPosX + 130, clockPosY)



  switch (direction) {
    case 'left':
      image(foreground, 0, 0, tick * windowWidth / tickMax - 1, windowHeight, 0, 0, tick * windowWidth / tickMax - 1, windowHeight)
      break;

    case 'up':
      image(foreground, 0, 0, windowWidth, tick * windowHeight / tickMax - 1, 0, 0, windowWidth, tick * windowHeight / tickMax - 1)
      break;

    case 'right':
      image(foreground, windowWidth-(tick * windowWidth / tickMax )-1, 0, windowWidth, windowHeight, windowWidth-(tick * windowWidth / tickMax )-1, 0, windowWidth, windowHeight)
      break;

    case 'down':
      image(foreground, 0, windowHeight-(tick * windowHeight / tickMax)-1, windowWidth, windowHeight, 0, windowHeight-(tick * windowHeight / tickMax )-1, windowWidth, windowHeight)
      break;
  }


  sOld = s
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  foreground.resizeCanvas(windowWidth, windowHeight);
  clockPosX = windowWidth / 2
  clockPosY = (windowHeight / 2) - 50
}

function mouseClicked() {
  userStartAudio();

  if(jazz.isPlaying() == false && isJazzReady == true)
    clieckEvent = 1
}

function jazzReady(){
  isJazzReady = true;
}
