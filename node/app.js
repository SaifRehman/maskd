// const models = require('@cloud-annotations/models-node');
// const fs = require('fs');
// async function load() {
//     const model = await models.load('model_web');
//     const image = fs.readFileSync('2.png');
//     const results =  await model.detect(image);
//     console.log(results);
//     const image2 = fs.readFileSync('3.png');
//     const results2 =  await model.detect(image2);
//     console.log(results2);
// }
// load();
const fs = require('fs')
const cv = require('opencv4nodejs');

const { createCanvas, loadImage } = require('canvas')

const width = 1200
const height = 630

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#000'
context.fillRect(0, 0, width, height)

context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.textBaseline = 'top'
context.fillStyle = '#3574d4'

const text = 'Hello, World!'

const textWidth = context.measureText(text).width
context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
context.fillStyle = '#fff'
context.fillText(text, 600, 170)

context.fillStyle = '#fff'
context.font = 'bold 30pt Menlo'
context.fillText('flaviocopes.com', 600, 530)
const buffer = canvas.toBuffer('image/png')
fs.writeFileSync('./test.png', buffer)
