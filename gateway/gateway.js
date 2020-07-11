const {
  Node,
  generateSecretKey
} = require("flatend");
const fs = require('fs');

const send = async(ctx) => {
  try{
    var abb =  await ctx.body({limit: 4194304})
    console.log(abb );
    fs.writeFileSync('1.jpg', abb);

  } catch (err){
    console.log('error')
    console.log(err)
  }

};

const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    bindAddrs: [`:9000`],
    services: {
      node: send
    }
  });
};

main().catch((err) => console.error(err));