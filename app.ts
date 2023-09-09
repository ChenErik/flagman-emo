import express from 'express'
import os from 'os'
import initImg from './utils/tools';
const app = express();

app.all('*', function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(express.static("./public"));

app.post("/api/v1/jpr", async(req, res) => {
  await initImg(req.body.content, (filename) => {
    res.json({
      code: 1,
      info: "/" + filename,
    });
  });
});
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let rAddress:string = ''
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        rAddress = address.address;
      }
    }
  }

  return {
    local:'127.0.0.1',
    remote: rAddress
  }; // 默认返回回环地址
}
const port:number = 3000
const host = getLocalIP()
app.listen(port,() => {
  console.log(`Local:Server running at http://${host.local}:${port}`);
  console.log(`Remote:Server running at http://${host.remote}:${port}`);
});