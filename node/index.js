var cv = require("opencv4nodejs");
const models = require('@cloud-annotations/models-node');
var COLOR = [0, 255, 0]; // default red
const handler = async (model, data) => {
    const results = await model.detect(data);
    return results;
}
async function load() {
    try {
        const model = await models.load('model_web');
        console.log("model is loaded");
        var camera = new cv.VideoCapture(0);

        // var window = new cv.NamedWindow('Video', 0)
        setInterval(function () {
            camera.readAsync((err, frame) => {
                
                cv.imshow('a window name', frame);

              });
            // let im = camera.read();
            // im.resize(700,500)
            const frame = im.toBuffer();
            console.log(im);
            handler(model, frame).then(res => {
                res.forEach(element => {
                    console.log(element);
                    im.rectangle([element.bbox[0], element.bbox[1]], [element.bbox[2], element.bbox[3]], COLOR, 2);
                    im.putText(im,'abc', [0,0], cv.FONT_HERSHEY_SIMPLEX, 0.1, 1)
                });
                // window.show(im);
            }, error => {
                console.log(error)
            })


        //   camera.read(function(err, im) {
        //     if (err) throw err;
        //     im.resize(700,500)
        //     console.log("bububu")
        //     const frame = im.toBuffer();
        //     handler(model, frame).then(res => {
        //         res.forEach(element => {
        //             console.log(element);
        //             im.rectangle([element.bbox[0], element.bbox[1]], [element.bbox[2], element.bbox[3]], COLOR, 2);
        //             im.putText(im,'abc', [0,0], cv.FONT_HERSHEY_SIMPLEX, 0.1, 1)
        //         });
        //         // window.show(im);
        //     }, error => {
        //         console.log(error)
        //     })
        // //   window.blockingWaitKey(0, 50);
        //   });
        }, 40);
      } catch (e){
        console.log("There was an error", e)
      }
}
load();
