const fs = require('fs');

const rs = fs.createReadStream('./41readstream.js');
//分发给控制台
//一点点吐给控制台
rs.pipe(process.stdout); 
