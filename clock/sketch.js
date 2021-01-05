let osc, playing, freq, amp;
let oscLong
let jazz
function preload(){
  jazz = loadSound('assets/jazz.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  textFont('Helvetica', 100, 100)
  textStyle(BOLD)

  osc = new p5.Oscillator('sine')
  oscLong = new p5.Oscillator('sine')

  oscLong.freq(1000)
  osc.freq(2000)
  osc.amp(0.1)

  colorMode(HSL)

}

var sOld = 0
var clieckEvent = 0

function draw() {

  let s = second()

  if(s != sOld){
    if(clieckEvent == 1 && jazz.isPlaying() == false){
      jazz.play()
      clieckEvent = 0
    }

    osc.start();
    osc.stop(0.02);

    if(s % 10 == 0){
      oscLong.amp(0.12)
      oscLong.start();
      oscLong.amp(0, 1.8)
    }
  

    if(s % 2 ==0){
      background('white')
      fill(360 * Math.random() , 160 + 70 * Math.random(), 75 + 10 * Math.random())
    } else {
      background(300 * Math.random() , 160 + 70 * Math.random(), 75 + 10 * Math.random())
      fill('white')
    }
    textFont('Helvetica', 100, 100)

    clockPosY = windowHeight / 2
    clockPosX = windowWidth / 2
  
    text(hour().toString().padStart(2,'0'), clockPosX - 130, clockPosY)
    text(minute().toString().padStart(2,'0'), clockPosX, clockPosY)
    text(s.toString().padStart(2,'0'), clockPosX + 130, clockPosY)

    sOld = s
  }

  textFont('Helvetica', 20, 20)
  text('click to play', clockPosX, clockPosY + 20)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  if(jazz.isPlaying() == false)
    clieckEvent = 1
}
