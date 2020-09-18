

const readline = require("readline");
const fs = require("fs");
const crypto = require('crypto');
const path = require('path');

const DELAY_MILISECOND = 1000;
const statusFolder = './Status/'


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


 
 
module.exports = {   
  readLines,
  delay,
  DELAY_MILISECOND,
  flatDeep,
  wait, 
  socketNotify,
  SocketEnum
};