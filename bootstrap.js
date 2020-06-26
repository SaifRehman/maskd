var cv = require('opencv');
const {
  Node,
  generateSecretKey
} = require("flatend");
const {
  Readable
} = require("stream");
const fs = require("fs");
const send = async (ctx) => {
  fs.createReadStream("bootstrap.js").pipe(ctx);
}
const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    bindAddrs: [`:9000`],
    services: {
      bootstrap: send
    }
  });
  try {
    var camera = new cv.VideoCapture(0);
    var window = new cv.NamedWindow('Video', 0)
    setInterval(async () => {
      var = im = await camera.read(function (err, im) {
        if (err) throw err;
        console.log(im.size())
        if (im.size()[0] > 0 && im.size()[1] > 0) {
          if (err) throw err;
          window.show(im);
        }
        window.blockingWaitKey(0, 50);
      });
      try {
        const stream = await node.push(["node"], {}, Readable.from(im));
      } catch (err) {
        console.log(err);
      }
    }, 20);
  } catch (e) {
    console.log("Couldn't start camera:", e)
  }
};

main().catch((err) => console.error(err));