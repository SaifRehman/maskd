var cv = require("opencv4nodejs");
const models = require('@cloud-annotations/models-node');
var COLOR = [0, 255, 0]; // default red
const handler = async (model, data) => {
    const results = await model.detect(data);
    return results;
}
const vCap = new cv.VideoCapture(0);
const delay = 50;
let done = false;

async function load() {
    try {
        const model = await models.load('model_web');
        console.log("model is loaded");
        while (!done) {
            let frame = vCap.read();
            console.log(frame);
            if (frame.empty) {
                vCap.reset();
                frame = vCap.read();
            }
            const a = frame.toBuffer();
            console.log(a);
            frame.putText('YSVYSVYVSYYSVYSVYSVYV', new cv.Point2(50, 50), cv.FONT_HERSHEY_SIMPLEX, 2, new cv.Vec3(0, 255, 0), 2)
            cv.waitKey(delay);
            cv.imshow("s", frame)
        }

    } catch {

    }
}