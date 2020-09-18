const fetch = require('node-fetch');
var request = require('request'); 

async function get(endpoint, headers) {
    const options = { headers };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json
    } else {
        const message = await response.text(); 
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function post(endpoint, headers, body) {
    const options = { method: 'POST', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200 || response.status == 201 || response.status == 204) {
        const json = await response.json();
        return json;
    } else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function put(endpoint, headers, body) {
    const options = { method: 'PUT', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json;
    } else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function patch(endpoint, headers, body) {
    const options = { method: 'PATCH', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json;
    } else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}


async function mydelete(endpoint, headers) {
    
    //endpoint = 'https://developer.api.autodesk.com/bim360/assets/v1/projects/3ab9d062-ed91-46a4-aa97-b40407b02a75/assets/54c0e8c1-9b80-47f0-8c78-df5f2d0e100e'
  return new Promise(function (resolve, reject) {

    request.delete({
      url: endpoint,
      headers: headers
       
    },
      function (error, response, body) {

        if (error) {
            resolve(false);  
        } else {
           resolve(true)  
        }
      }); 
  }); 
}



module.exports = {
    get,
    post,
    put,
    patch,
    mydelete
};