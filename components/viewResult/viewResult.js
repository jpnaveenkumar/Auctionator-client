import styles from './viewResult.module.css';
import {useEffect, useState} from 'react';
import {httpGet} from '../../library/httpRequest';
export default function ViewResult({productId, onModalClose})
{
    function closeModal(e){
        if(e.target.id == "overlay"){
            onModalClose();
        }
    }

    const [status, updateStatus] = useState("fetching");
    const [bidInfo, updateBidInfo] = useState([]);
    function getWindowHeight(){
        return window.innerHeight;
    }

    useEffect( async ()=>{
        let url = `/bid/maxBidAmountForProductAllUser`;
        let params = {
            "productId" : productId
        };
        let bidInfos = await httpGet(url, params, {});
        if(bidInfos.length > 0){
            let userInfos = await Promise.all(
                bidInfos.map(bidInfo => {
                    return httpGet(`/user/${bidInfo["userId"]}`, {}, {});
                })
            );
            for(let index=0; index < userInfos.length; index++){
                bidInfos[index]["user"] = userInfos[index];
            }
            bidInfos.sort((a,b) => b["maxBidAmountForThisProduct"] - a["maxBidAmountForThisProduct"]);
            console.log(bidInfos);
            updateBidInfo(bidInfos);
            updateStatus("loaded");
        }else{
            updateStatus("empty");
        }
        
    }, []);

    function getContent()
    {
        if(status == "fetching"){
            return (
                <div className={styles.loading}>
                    Fetching Bidding Results...
                </div>
            );
        }else if(status == "empty"){
            return (
                <div className={styles.loading}>
                    No results found...
                </div>
            );
        }else{
            return (
                <div>
                    <div className={`${styles.resultRow} ${styles.resultHeader}`}>
                        <div> Rank </div>
                        <div> User Details </div>
                        <div> Bid Amount </div>
                    </div>
                    {
                        bidInfo.map((info, index) => {
                            return (
                                <div key={index} >
                                    <div className={`${styles.resultRow}`}>
                                        <div>{index + 1}</div>
                                        {
                                            <div>
                                                <div>{info["user"]["userName"]}</div>
                                                <div>{info["user"]["userEmail"]}</div>
                                                <div>{info["user"]["userPhoneNumber"]}</div>
                                            </div>
                                        }
                                        <div>{info["maxBidAmountForThisProduct"]}</div>
                                    </div>
                                    <div className={`${ index+1 < bidInfo.length ? styles.divider : ''}`}>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        }
    }

    return (
        <div id="overlay" onClick={closeModal} className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.heading}>
                    Bidding Results
                </div>
                    { getContent() }
            </div>
        </div>
    );
}