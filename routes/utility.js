

const readline = require("readline");
const fs = require("fs");  
const mkdir = require('mkdirp')

const DELAY_MILISECOND = 500;

const Excel_Uploads = './Excel_Uploads/'
const Excel_Exports = './Excel_Exports/'

if(!fs.existsSync(Excel_Uploads))
  mkdir.mkdirp(Excel_Uploads,(err)=>{if(!err)console.log('folder ./EXCEL_Uploads/ is created')})

if(!fs.existsSync(Excel_Exports))
  mkdir.mkdirp(Excel_Exports,(err)=>{if(!err)console.log('folder ./Excel_Exports/ is created')})

const SocketEnum = {
  ASSET_TOPIC: 'asset topic',
  EXPORT_ONEPAGE_DONE:'export one page done',
  EXPORT_DONE: 'export done' ,
  IMPORT_DONE:'import done',
  DELETE_DONE:'delete done' 
};  
  
function socketNotify(topic,message,data){
  //notify client
  var sockketData = {message:message,data:data} 
  global.MyApp.SocketIo.emit(topic, JSON.stringify(sockketData));
} 

async function readLines(prompt) {
  return new Promise(resolve => {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question(
        '\n'+prompt,
        function(answer) {   
          resolve(answer) 
          rl.close()
      })
  }); 
 }

//to avoid the problem of 429 (too many requests in a time frame)
async function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

const wait =  async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
};



String.prototype.format =function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i){
      return args[i];
  });
};

//from https://stackoverflow.com/questions/8495687/split-array-into-chunks
Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function(chunkSize) {
    var array = this;
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});

 
 
module.exports = {   
  readLines,
  delay,
  DELAY_MILISECOND,
  flatDeep,
  wait, 
  socketNotify,
  SocketEnum
};