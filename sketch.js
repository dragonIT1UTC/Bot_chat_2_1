let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let speech = new p5.Speech(); 
let conversation = [];
let img;
let continuous = true; 
let interim = false; 
speechRec.start(continuous, interim);
let stopListening = false;

let mobileWidth = 300; 
let mobileHeight = 550; 
let padding = 20; 
let cornerRadius = 20; 
let spoken = {};
let lastSpeech = '';
let chillSound ; 
let checkchillSound = true ; 
let phoneImg;

function preload() {
  chillSound = loadSound('chillSound.mp3');
  phoneImg = loadImage('mobile.png');
  img = loadImage('https://thumbnailer.mixcloud.com/unsafe/300x300/extaudio/b/6/6/4/dc7c-0e61-4696-b37a-3e15e09051ef');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill(255);
  image(phoneImg, (windowWidth - 1.4*mobileWidth) / 2 , (windowHeight - 1.25*mobileHeight) / 2, 1.4*mobileWidth, 1.25*mobileHeight);
  fill(0);
  textSize(15);
  textAlign(CENTER); 
  fill(0);
  text("Ask Siri to recommend music", windowWidth / 2, (windowHeight - mobileHeight) / 2 - 4*padding); 
  textAlign(LEFT);
  let y = (windowHeight - mobileHeight) / 2 + padding;
  for (let i = 0; i < conversation.length; i++) {
    let x = (windowWidth - mobileWidth) / 2 + padding;
    if (!conversation[i].startsWith('You :') ) {
      x += mobileWidth / 5;
      fill(0, 255, 0); 
      if(!spoken[conversation[i]]){
        speech.speak(conversation[i]);
        spoken[conversation[i]] = true;
      } 
    } else {
      fill(0);
    }
    textSize(18); 
    textLeading(25); 
    y = drawText(conversation[i], x, y + 50, LEFT, color(0));
    if (y > (windowHeight + mobileHeight) / 2 - padding) { 
      break;
    }
  }
  
  if (conversation.includes('Now, playing Ariana Grande \'7 Ring\'')) {
    if (img && img.width > 0) {
      img.resize(100, 100); 
      image(img, (windowWidth - img.width) / 2, (windowHeight + mobileHeight) / 2 - img.height - padding);
    }
  }
}

function gotSpeech() {
  if (speechRec.resultValue && !stopListening) {
    conversation.push('You : Hey Siri, Recommend some music');
    setTimeout(function(){ 
      conversation.push("Okay, check now this new release by Ariana Grande, your recent favorite artist");
      setTimeout(function(){ 
        conversation.push('Now, playing Ariana Grande \'7 Ring\'');
        setTimeout(function(){ 
          conversation = [];
          conversation.push("Now, playing Ariana Grande '7 Ring'");
          if(checkchillSound){
            chillSound.play();
            checkchillSound = false;
          }
          setTimeout(function(){ 
            conversation = [];
            conversation.push("Do you like my music suggestion?");
            speechRec.resultString = '';
            setTimeout(function(){ 
              setTimeout(function(){
                lastSpeech = 'You : ' + speechRec.resultString;
                conversation.push(lastSpeech);
                setTimeout(function(){ 
                  conversation.push("Ok , noted");
              
                }, 3000);
              }, 2000); 
            }, 5000);
          }, 10000);
        }, 1000);
      }, 5000);
    }, 2000);
  }
  stopListening = true ; 
}

function drawText(txt, x, y, align, col) {
  textAlign(align);
  let words = txt.split(' ');
  let line = '';
  let startY = y;
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);
    if (testWidth > mobileWidth - 2 * padding && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
      y += textAscent() + textDescent();
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  fill(255); 
  let rectWidth = min(textWidth(txt) + padding, mobileWidth - 2 * padding);
  let rectX = align === LEFT ? x - padding / 2 : x - rectWidth + padding / 2;
  rect(rectX, startY - textAscent() - padding / 2, rectWidth, y - startY + textAscent() + textDescent() + padding, 20); 
  fill(col);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, startY + i * (textAscent() + textDescent())); 
  }
  return y;
}
