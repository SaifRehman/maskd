var NodeWebcam = require("node-webcam");
const models = require('@cloud-annotations/models-node');
const Canvas = require('canvas')
const fs = require('fs')

var opts = {
    width: 600,
    height: 600,
    delay: 0,
    quality: 100,
    device: false,
    callbackReturn: "buffer",
    saveShots: false,
    verbose: true
}
var Webcam = NodeWebcam.create(opts);

const handler = async (model, data) => {
    const results = await model.detect(data);
    return results;
}
async function load() {
    const model = await models.load('model_web');
    setInterval(function () {
        Webcam.capture("", function (err, data) {
            handler(model, data).then(res => {
                var img = new Canvas.Image; // Create a new Image
                img.src = data;
                console.log(img.width, img.height)
                var canvas = new Canvas.Canvas(img.width, img.height);
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2);
                if (res.length > 0) {
                    res.forEach(element => {
                        console.log(element);
                        ctx.beginPath();
                        ctx.lineWidth = "3";
                        ctx.strokeStyle = "red";
                        ctx.rect(element.bbox[0] / 2, element.bbox[1] / 2, element.bbox[2] / 2, element.bbox[3] / 2);
                        ctx.stroke();
                        ctx.font = 'bold 15pt Menlo'
                        ctx.textAlign = 'center'
                        ctx.fillStyle = '#000000'
                        ctx.fillText(element.label, (element.bbox[0] / 2), (element.bbox[1] / 2)+element.bbox[3] / 4)
                    });

                }
                const buffer = canvas.toBuffer('image/png')
                fs.writeFileSync('./output.png', buffer)
            }, error => {
            })
        });
    }, 200)
}
load()