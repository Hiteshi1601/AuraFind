import { imageHash } from "image-hash";
import sharp from "sharp";
import Jimp from "jimp";

async function loadAsPngBuffer(imgPath) {
  return await sharp(imgPath).toFormat("png").trim().toBuffer();
}

function getHash(buffer) {
  return new Promise((resolve, reject) => {
    imageHash({ data: buffer }, 16, true, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

function countSetBits(num) {
  let count = 0;
  while (num > 0) {
    if (num & 1) count++;
    num >>= 1;
  }
  return count;
}

function getHammingDistance(hex1, hex2) {
  let distance = 0;
  for (let i = 0; i < hex1.length; i++) {
    const bitwiseDiff = parseInt(hex1[i], 16) ^ parseInt(hex2[i], 16);
    distance += countSetBits(bitwiseDiff);
  }
  return distance;
}

export async function compareImages(img1Path, img2Path) {
  try {
    const img1Buffer = await loadAsPngBuffer(img1Path);
    const img2Buffer = await loadAsPngBuffer(img2Path);

    const hash1 = await getHash(img1Buffer);
    const hash2 = await getHash(img2Buffer);

    const distance = getHammingDistance(hash1, hash2);
    const totalBits = hash1.length * 4;

    const diffValue = distance / totalBits;
    return diffValue;
  } catch (error) {
    console.error("Error comparing images:", error);
    throw error;
  }
}