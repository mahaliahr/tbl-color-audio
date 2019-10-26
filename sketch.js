// Muted color palette
const bauhausBg = ["#BEBCB4", "#DFD9CA", "#1E2019"];
const bauhausColors = ["#B2534D", "#F2DE9A", "#1e7bb4"];
let bgColor;
let seed;
let xoff = 0.0;
let analyser;
let mic;

let playing = true;

// Create a new canvas to the browser size
async function setup() {
  if (mic) {
    mic.dispose();
    mic = null;
  } else {
    mic = new Tone.UserMedia();

    await mic.open();
    console.log("opened microphone", mic.label);

    analyser = new AudioEnergy();

    mic.connect(analyser);
    mic.connect(Tone.Master);
  }

  createCanvas(windowWidth, windowHeight);
  bgColor = random(bauhausBg);
  updateRandomness();
  setInterval(updateRandomness, 1000);

  //noLoop();
  // frameRate(3);
}

function updateRandomness() {
  // some value between 0 and a big number
  seed = random(0, 1000000);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  if (!mic || !analyser) return;
  analyser.update();
  
  if (playing) {
    const bass = analyser.getEnergy(20, 100);
    const basslevel = map(bass, -100, -30, 0, 100, true);

    const highend = analyser.getEnergy(9000, 10000);
    const highendlevel = map(highend, -100, -30, 0, 100, true);

    const mid = analyser.getEnergy(400, 2600);
    const midlevel = map(mid, -100, -30, 0, 100, true);

    randomSeed(seed);
    let dim = min(width, height);
    blendMode(BLEND);
    // // Brighter color palette
    // const brightBauhausColors = ["#DA4421", "#1E2019", "#7B847A", "#DBB939"];
    const time = millis() / 1000;
    // INSERT NOISE
    xoff = xoff + 0.01;
    let n = noise(xoff) * width;
    const frequency = 0.3 * n * 0.001;
    const v = sin(time * frequency);
    const anim = v * 1 + 1;
    // background
    background(bgColor);
    //const dim = min(width, height);
    //stroke("#fff");

    blendMode(DIFFERENCE);

    drawEachTile(
      width / 2,
      height / 2,
      dim * 0.5 * anim * (basslevel/100),
      220,
      time * 0.5
    );

    drawEachTile(
      width / 2,
      height / 2,
      dim * 0.9 * anim * (midlevel/100),
      180,
      time * 0.5
    );

    drawEachTile(
      width / 2,
      height / 2,
      dim * 0.2 * anim * (highendlevel/60),
      80,
      time * 0.5
    ); 

    //drawColumns(width / 2, height / 2, 100, 100, time * 0.2);
    //blendMode(BURN);
    // drawOutline(
    //   width / 2,
    //   height / 2,
    //   dim * 0.2 * max(anim, 0.6),
    //   80,
    //   time * 0.5
    // );

    // drawEachTile(width / 2, height / 2, 100, 300, 0);
  }
}

// Creates circle of circles
function drawEachTile(x, y, radius, sides = 3, angle = 0) {
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    if (i % 10 == 0) {
      drawTile(sx, sy);
    }
  }
}

// function drawOutline(x, y, radius, sides = 3, angle = 0) {
//   for (let i = 0; i < sides; i++) {
//     const a = angle + TWO_PI * (i / sides);
//     let sx = x + cos(a) * radius;
//     let sy = y + sin(a) * radius;
//     if (i % 10 == 0) {
//       drawTileOutline(sx, sy);
//     }
//   }
// }

// function drawColumns(x, y, radius, sides = 3, angle = 0) {
//   for (let i = 0; i < sides; i++) {
//     const a = angle + TWO_PI * (i / sides);
//     let sx = x + cos(a) * radius * 2;
//     let sy = y + sin(a) * radius * 2;
//     let ex = x + cos(a) * radius * 10;
//     let ey = y + sin(a) * radius * 10;
//     if (i % 10 == 0) {
//       drawColumn(sx, sy, ex, ey);
//     }
//   }
// }

// ROTATE FUNCTION

// function turn(obj) {}

// SIZE OF CIRCLE FUNCTION

function drawTile(sx, sy) {
  xoff = xoff + 0.0002;
  let n = noise(xoff) * width;
  const frequency = 0.1 * n * 0.001;
  const dim = min(width, height);
  noStroke();
  fill(random(bauhausColors));
  circle(sx + frequency, sy + frequency, dim * 0.25, dim * 0.25);
}

// function drawTileOutline(sx, sy) {
//   xoff = xoff + 0.0002;
//   let n = noise(xoff) * width;
//   const frequency = 0.1 * n * 0.001;
//   const dim = min(width, height);
//   strokeWeight(dim * 0.02);
//   stroke(random(bauhausColors));
//   noFill();
//   circle(sx + frequency, sy + frequency, dim * 0.25, dim * 0.25);
// }

function drawColumn(sx, sy, ex, ey) {
  const dim = min(width, height);
  noFill();
  strokeCap(SQUARE);
  strokeWeight(dim * 0.2);
  stroke("#fff");
  line(sx, sy, ex, ey);
}
