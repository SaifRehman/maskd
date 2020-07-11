var cv = require("opencv4nodejs");
const models = require('@cloud-annotations/models-node');
const {
  Node,
  generateSecretKey
} = require("flatend");
const {
  Readable
} = require("stream");
const vCap = new cv.VideoCapture(0);
const delay = 50;
const blue = new cv.Vec(255, 0, 0);
const thickness = 1;
async function load() {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    addrs: ["158.177.144.174:9000"]
  });
  try {
    const model = await models.load('model_web');
    console.log("model is loaded");
    setInterval( async () => {
      let frame = vCap.read();
      var buffer = cv.imencode('.jpg', frame)
      const results = await model.detect(buffer);
      console.log(results);
      results.forEach(element => {
        frame.drawRectangle(
          new cv.Point(element.bbox[0], element.bbox[1]),
          new cv.Point(element.bbox[0] + element.bbox[2], element.bbox[1] + element.bbox[3]),
          blue,
          cv.LINE_8,
          thickness
        );
        frame.putText(element.label, new cv.Point2(element.bbox[0], element.bbox[1] + element.bbox[3]), cv.FONT_HERSHEY_SIMPLEX, 2, new cv.Vec3(0, 255, 0), 2)
      });
      if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
      }
      var newsize = frame.resize(500, 500);
      var newbuffer = cv.imencode('.jpg', newsize)
      console.log(newbuffer)
      await node.push(["node"], {}, Readable.from([newbuffer]));
      cv.waitKey(delay);
    }, 300);


  } catch (err) {
    console.log(err)

  }
}
load()