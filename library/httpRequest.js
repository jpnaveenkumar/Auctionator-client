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