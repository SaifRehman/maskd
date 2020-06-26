var cv = require('opencv');
const util = require('util')

const {
  Node,
  generateSecretKey
} = require("flatend");
var data ;
const send = async (ctx) => {
  ctx.send(`${data}`);
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
    var camera = await new cv.VideoCapture(0);
    var window = await new cv.NamedWindow('Video', 0)
    setInterval(async () => {
      var image = await camera.read( (err, im) => {
        if (err) throw err;
        data = im;
        console.log(util.inspect(im, false, null, true /* enable colors */))

        if (im.size()[0] > 0 && im.size()[1] > 0) {
          if (err) throw err;
          // window.show(im);
        }
        // window.blockingWaitKey(0, 50);
      });
      return image
    }, 100);
  } catch (e) {
    console.log("Couldn't start camera:", e)
  }
};

main().catch((err) => console.error(err));