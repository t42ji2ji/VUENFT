// get the image at input.png, scale it to be 20x bigger, and store the result in output.png
/* eslint-disable @typescript-eslint/no-var-requires */
// const scalePixelArt = require('scale-pixel-art');
const fs = require('fs');
const sharp = require('sharp');

// Display data
async function scaleImage12(input, scale) {
  const image = sharp(input);
  const metadata = await image.metadata();
  const output = await image
    .resize(metadata.width * scale, null, { kernel: 'nearest' })
    .toBuffer();
  return output;
}

async function getScaleImage() {
  const limitOfAttr = {
    body: 9,
    clothe: 19,
    eye: 12,
    glasses: 4, //can null
    hair: 12, //can null
    mouse: 8,
    special: 14, //can null
  };
  for (const [key, value] of Object.entries(limitOfAttr)) {
    for (var i = 0; i < value; i++) {
      console.log(`run: ./src/assets/nfts/${key}/${i}.png`);
      const inputBuffer = fs.readFileSync(`./src/assets/nfts/${key}/${i}.png`);
      var outputBuffer = await scaleImage12(inputBuffer, 6);
      fs.writeFileSync(`./src/assets/nfts/${key}/${i}.png`, outputBuffer);
      console.log(`finish: ./src/assets/nfts/${key}/${i}.png`);
    }
  }
}

getScaleImage();
