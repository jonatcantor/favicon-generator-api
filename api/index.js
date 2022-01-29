const sharp = require('sharp');

const iconBuffer = async (base64Data) => {
  const base64Buffer = Buffer.from(base64Data, 'base64');
  const resizeBuffer = await sharp(base64Buffer)
    .resize(32)
    .toBuffer();

    return resizeBuffer;
}

const responseGlobal = async (request, response) => {
  if(request.method.toUpperCase() === 'OPTIONS') {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Credentials", true);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return response.end();
  }

  if(request.method.toUpperCase() !== 'POST') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    return response.end(JSON.stringify({ error: 'Method not allowed' }));
  };

  let data = '';

  request.on('data', chunk => {
    data += chunk;
  });

  request.on('end', async () => {
    const base64 = JSON.parse(data).image;
    const base64Data = base64.replace(/^data:image\/png;base64,/, '');
    const resizeBufferBase64 = await (await iconBuffer(base64Data)).toString('base64');
    const resizeData = 'data:image/x-icon;base64,' + resizeBufferBase64;
  
    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.end(JSON.stringify({ image: resizeData }));
  });
}

if(process.env.PRODUCTION === 'false') {
  const http = require('http');

  const PORT = process.env.PORT || 5000;
  const server = http.createServer(responseGlobal);

  server.listen(PORT, () => console.log(`Server listing on port: ${ PORT }`));
}

else {
  module.exports = responseGlobal;
}
