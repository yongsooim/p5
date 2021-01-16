let osc, playing, freq, amp, oscLong
let jazz, isJazzReady = false
let house, isHouseReady = false
let lofi, isLofiReady = false
let isAllReady = false
let foreground
let direction = 'left'
let tick = 0
let transitionDone = false;
const tickMax = 25
var offset = new Date().getTimezoneOffset();
var gmt = -offset / 60;
var clockPosX, clockPosY
var gmtString = (gmt >= 0) ? 'GMT+' + gmt : 'GMT' + gmt;
var bezierTickArr = []
var selected
var selectedText = 'jazz'

var sOld = 0
var clieckEvent = false
var randomColor = [360 * Math.random(), 55 + 10 * Math.random(), 75 + 10 * Math.random()]; // HSB
var nextRandomColor = [360 * Math.random(), 55 + 10 * Math.random(), 75 + 10 * Math.random()]; // HSB

function setup() {
  getAudioContext().suspend();

  createCanvas(windowWidth, windowHeight)
  foreground = createGraphics(windowWidth, windowHeight);

  textStyle(BOLD)
  foreground.textStyle(BOLD)

  osc = new p5.Oscillator('sine')
  oscLong = new p5.Oscillator('sine')

  oscLong.freq(1000)
  osc.freq(2000)
  osc.amp(0.2)

  jazz = loadSound('assets/jazz.m4a', jazzReady);
  house = loadSound('assets/house.m4a', houseReady);
  lofi = loadSound('assets/lofi.m4a', lofiReady);

  selected = jazz
  colorMode(HSB, 360, 100, 100)
  foreground.colorMode(HSB, 360, 100, 100)
  clockPosX = windowWidth / 2
  clockPosY = (windowHeight / 2) - 50


  for (var i = 0; i <= tickMax; i++) {
    var t = i / tickMax;
    bezierTickArr[i] = bezierPoint(0, 0.85, 0.9, 1, t);
  }
}

function draw() {

  let s = second()

  if (tick < tickMax) {
    tick++
  }

  if (s != sOld) { /* once a second */
    if (clieckEvent == true && selected.isPlaying() == false) {
      selected.play()
      clieckEvent = 0
    }

    tick = 0
    transitionDone = false
    osc.start();
    osc.stop(0.02);

    if (s % 10 == 0) {
      oscLong.amp(0.2)
      oscLong.start();
      oscLong.amp(0, 1.8)
    }

    if (s % 2 == 0) {
      do {
        var nextHue = 360 * Math.random()
        var diffAngle = ((nextHue - randomColor[0]) + 180) % 360 - 180
      } while (diffAngle > 30 && diffAngle < -150)

      nextRandomColor = [nextHue, 15 + 40 * Math.random(), 55 + 20 * Math.random()];
    }

    switch (direction) {
      case 'left': direction = 'up'; break;
      case 'up': direction = 'right'; break;
      case 'right': direction = 'down'; break;
      case 'down': direction = 'left'; break;
    }
  }


  if (transitionDone == false) {
    if (s % 2 == 0) {
      background('white')
      fill(randomColor[0], randomColor[1], randomColor[2])
    } else {
      background(randomColor[0], randomColor[1], randomColor[2])
      fill('white')
    }

  } else {
    if (s % 2 == 0) {
      background(randomColor[0], randomColor[1], randomColor[2])
      fill('white')

    } else {
      background('white')
      fill(randomColor[0], randomColor[1], randomColor[2])
    }

  }

  drawTime(this)
  drawInfo(this)

  if (tick >= tickMax) {
    randomColor = nextRandomColor;
    transitionDone = true;
  }

  if (s % 2 == 0) {
    foreground.background(nextRandomColor[0], nextRandomColor[1], nextRandomColor[2])
  } else {
    foreground.background('white')
  }

  drawTime(foreground)
  drawInfo(foreground)

  if (s % 2 == 0) {
    foreground.fill('white')
  } else {
    foreground.fill(nextRandomColor[0], nextRandomColor[1], nextRandomColor[2])
  }

  drawTransition()

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

  if(isAllReady == true){
    if (clieckEvent == true) {
      clieckEvent = false
    } else if (selected.isPlaying() == false && isAllReady) {
      clieckEvent = true
    }

    if (selected.isPlaying() == true) {
      selected.stop();
    }

    textAlign(RIGHT)
    textFont('Helvetica', 20, 20)
    var w = textWidth('jazz')
    if (mouseX >= clockPosX - 50 - w - 10 && mouseX <= clockPosX - 50 + 10 &&
      mouseY >= clockPosY + 105 - 25 && mouseY <= clockPosY + 105 + 5) {
      selected = jazz
      selectedText = 'jazz'
      clieckEvent = true
    }

    w = textWidth('house')
    if (mouseX >= clockPosX - (w/2) - 10 && mouseX <= clockPosX + (w/2) + 10 &&
      mouseY >= clockPosY + 105 - 25 && mouseY <= clockPosY + 105 + 5) {
      selected = house
      selectedText = 'house'
      clieckEvent = true
      console.log('house clicked')
      console.log(selected)
    }

    w = textWidth('lofi')
    if (mouseX >= clockPosX +45 - 10 && mouseX <= clockPosX + 45 + w + 10 &&
      mouseY >= clockPosY + 105 - 25 && mouseY <= clockPosY + 105 + 5) {
      selected = lofi
      selectedText = 'lofi'
      clieckEvent = true
      console.log('lofi clicked')

    }
  }
}

function jazzReady() {
  isJazzReady = true;
  selected = jazz
  if(isJazzReady == true && isHouseReady == true && isLofiReady == true){
    isAllReady = true
  }
}

function houseReady() {
  isHouseReady = true;
  if(isJazzReady == true && isHouseReady == true && isLofiReady == true){
    isAllReady = true
  }
}

function lofiReady() {
  isLofiReady = true;
  if(isJazzReady == true && isHouseReady == true && isLofiReady == true){
    isAllReady = true
  }
}

function drawTime(canvas) {
  canvas.textFont('Helvetica', 100, 100)
  canvas.textAlign(CENTER);
  canvas.text(hour().toString().padStart(2, '0'), clockPosX - 130, clockPosY)
  canvas.text(minute().toString().padStart(2, '0'), clockPosX, clockPosY)
  canvas.text(second().toString().padStart(2, '0'), clockPosX + 125, clockPosY)
}

function drawInfo(canvas) {

  canvas.textFont('Helvetica', 30, 30)
  canvas.textAlign(CENTER);
  canvas.text(gmtString, clockPosX, clockPosY + 40);

  if (selected.isPlaying() == true || clieckEvent == true) {
    canvas.textFont('Helvetica', 40, 40)
    canvas.text('\u25A0', clockPosX, clockPosY + 75)
  } else if (isAllReady) {
    canvas.textFont('Helvetica', 30, 30)
    canvas.text('\u25B6', clockPosX, clockPosY + 75)
  } else {
    canvas.textFont('Helvetica', 20, 20)
    canvas.text('loading', clockPosX, clockPosY + 70)
  }

  canvas.textFont('Helvetica', 20, 20)
  canvas.textAlign(RIGHT);

  if(selectedText == 'jazz'){
    canvas.textStyle(BOLDITALIC);
    canvas.text('jazz', clockPosX - 50, clockPosY + 105)
    canvas.textStyle(BOLD);
  } else {
    canvas.text('jazz', clockPosX - 50, clockPosY + 105)
  }


  canvas.textAlign(CENTER);

  if(selectedText == 'house'){
    canvas.textStyle(BOLDITALIC);
    canvas.text('house', clockPosX, clockPosY + 105)
    canvas.textStyle(BOLD);
  } else {
    canvas.text('house', clockPosX, clockPosY + 105)
  }

  canvas.textAlign(LEFT);

  if(selectedText == 'lofi'){
    canvas.textStyle(BOLDITALIC);
    canvas.text('lofi', clockPosX + 45, clockPosY + 105)
    canvas.textStyle(BOLD);

  } else {
    canvas.text('lofi', clockPosX + 45, clockPosY + 105)
  }

}

function drawTransition() {
  switch (direction) {
    case 'left':
      image(foreground, 0, 0, bezierTickArr[tick] * windowWidth - 1, windowHeight, 0, 0, bezierTickArr[tick] * windowWidth - 1, windowHeight)
      break;

    case 'up':
      image(foreground, 0, 0, windowWidth, bezierTickArr[tick] * windowHeight - 1, 0, 0, windowWidth, bezierTickArr[tick] * windowHeight - 1)
      break;

    case 'right':
      image(foreground, windowWidth - (bezierTickArr[tick] * windowWidth) - 1, 0, windowWidth, windowHeight, windowWidth - (bezierTickArr[tick] * windowWidth) - 1, 0, windowWidth, windowHeight)
      break;

    case 'down':
      image(foreground, 0, windowHeight - (bezierTickArr[tick] * windowHeight) - 1, windowWidth, windowHeight, 0, windowHeight - (bezierTickArr[tick] * windowHeight) - 1, windowWidth, windowHeight)
      break;
  }
}