const axios = require('axios');

const developmentServerURL = "http://localhost:8080";
export function httpGet(apiURL, params, headers)
{
    const requestURL = developmentServerURL + apiURL;
    return new Promise((resolve, reject) => {
        axios.get(requestURL, {
            params,
            headers
        }).then(function(response){
            if(response.status == 200){
                    resolve(response["data"]["data"]);
            }else{
                reject(response["data"]["message"])
            }
        }).catch(function(error){
            console.log(error);
            reject("Something went wrong");
        });
    });
}

export function httpPost(apiURL,params) {
    const requestURL = developmentServerURL + apiURL;
    const headers = {
        "Content-Type": "application/json",
        'Accept': 'application/json'
    }
    return new Promise((resolve, reject) => {
        axios.post(requestURL, 
            params,
            headers
            ).then(function(response){
            if(response.status == 201 || response.status == 200){
                    resolve(response["data"]["data"]);
            }else{
                reject(response["data"]["message"])
            }
        }).catch(function(error){
            console.log(error);
            reject("Something went wrong");
        });
    });
}