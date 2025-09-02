const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  const modelPath = path.join(__dirname, 'models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
}

async function loadImage(imagePath) {
  const img = await canvas.loadImage(imagePath);
  return faceapi.createCanvasFromMedia(img);
}

async function getFaceDescriptor(imagePath) {
  const img = await loadImage(imagePath);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error(`No face detected in ${imagePath}`);
  return detection.descriptor;
}

module.exports = async function verifyFaces(imagePath1, imagePath2) {
  await loadModels();
  const descriptor1 = await getFaceDescriptor(imagePath1);
  const descriptor2 = await getFaceDescriptor(imagePath2);

  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const threshold = 0.6;

  return {
    match: distance < threshold,
    distance: distance.toFixed(4),
  };
};
