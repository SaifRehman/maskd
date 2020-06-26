var cv = require('opencv');
const { Readable } = require("stream");

const {
  Node,
  generateSecretKey
} = require("flatend");
const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    addrs: [`:9000`]
  });
  const camera = new cv.VideoCapture(0);
  const window = new cv.NamedWindow('Video', 0);
  setInterval(async () => {
    try {
      const image = await new Promise((resolve, reject) => {
        camera.read((err, image) => {
          if (err) {
            reject(err)
          } else {
            resolve(image)
          }
        })
      });
      const [width, height] = image.size();
      if (width === 0 || height === 0) return;
      const frame = image.toBuffer();
      console.log(frame);
      await node.push(["node"], {}, Readable.from(frame));
    } catch (err) {
      console.error("Failed to read and send camera frame:", err);
    }
  }, 100);
};

main().catch((err) => console.error(err));