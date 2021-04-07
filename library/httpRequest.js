const axios = require('axios');
const mode = "prod";
const developmentServerURL = "http://localhost:8080";
const productionServerURL = "http://auctionator.us-east-1.elasticbeanstalk.com";
export function httpGet(apiURL, params, headers)
{
    const requestURL = mode == "dev" ? developmentServerURL + apiURL : productionServerURL + apiURL;
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

export function httpPost(apiURL,params,headers) {
    const requestURL = mode == "dev" ? developmentServerURL + apiURL : productionServerURL + apiURL;
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