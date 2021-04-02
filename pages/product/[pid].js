import styles from './productDetails.module.css';
import {httpGet} from '../../library/httpRequest';
import StickyHeader from '../../components/stickyHeader/stickyHeader';
import ProductsCarousell from '../../components/productsCarousell/productsCarousell';
import Footer from '../../components/footer/footer';
import {useEffect, useState} from 'react';
import {getRemainingTime} from '../../library/dateHelper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Client, Message } from '@stomp/stompjs';
import { connect } from 'react-redux';
import {httpPost} from '../../library/httpRequest';
import ValuationTool from '../../components/valuationTool/valuationTool';
function ProductDetails({productInfo, err, upcoming, ongoing, user})
{

    function getProductStatus(items)
    {
            let startTime = new Date(productInfo["startTime"]);
            let endTime = new Date(productInfo["endTime"]);
            let currentTime =  new Date();
            if(currentTime>= startTime && currentTime <=endTime){
                return "ongoing";
            }else if (currentTime < startTime){
                return "upcoming";
            }
    }

    function openValuationToolModal()
    {
        updateShowValuationToolModal(true);
        document.body.style.overflow = "hidden";
    }

    function onModalClose(){
        updateShowValuationToolModal(false);
        document.body.style.overflow = "";
    }

    const [timeLeft, updateTimeLeft] = useState(" ");
    const [ongoingBidding, updateOngoingBidding] = useState(ongoing);
    const [upcomingBidding, updateUpcomingBidding] = useState(upcoming);
    const [productStatus, updateProductStatus] = useState(getProductStatus());
    const [sellerInfo, updateSellerInfo] = useState(null);
    const [userMaxBix, updateUserMaxBid] = useState(null);
    const [bidAmount, updateBidAmount] = useState(0);
    const [bidErrorMessage, updateBidErrorMessage] = useState("");
    const [showValuationToolModal, updateShowValuationToolModal] = useState(false);

    const handleOngoingEventsTimerExpiry = async () => {
        setTimeout(async () => {
          const events = await httpGet("/product/all?pageNumber=0&pageSize=10&statuses=Ongoing",{},{});
          updateOngoingBidding(events);
        }, 1000);
      }
    
    const handleUpcomingEventsTimerExpiry = async () => {
        setTimeout(async () => {
            const result = await Promise.all([
            httpGet("/product/all?pageNumber=0&pageSize=10&statuses=Upcoming",{},{}),
            httpGet("/product/all?pageNumber=0&pageSize=10&statuses=Ongoing",{},{})
            ]);
            updateOngoingBidding(result[1]);
            updateUpcomingBidding(result[0]);
        }, 1000);
    }

    useEffect(()=>{
        let timer = setInterval(() => {
            let timeLeft;
            if(productStatus == "ongoing"){
                timeLeft = getRemainingTime(new Date().toISOString(),productInfo["endTime"]);
            }else if(productStatus == "upcoming"){
                timeLeft = getRemainingTime(new Date().toISOString(),productInfo["startTime"]);
            }
            if(timeLeft == " 0 hr : 0 min : 0 sec"){
                clearInterval(timer);
                timerExpiryCallback();
                return;
            }
            updateTimeLeft(timeLeft);
        }, 1000);
        return () => clearInterval(timer);
    },[])

    useEffect( async  ()=>{
        const sellerInfo = await httpGet(`/user/${productInfo["userId"]}`,{},{});
        updateSellerInfo(sellerInfo);
    },[]);

    useEffect( async ()=>{
        if(user){
            let params = {
                productId : productInfo["productId"],
                userId : user["userId"]
            };
            const getUserMaxBid = await httpGet(`/bid/maxBidAmountForProductByUser`, params, {});
            console.log(getUserMaxBid);
            updateUserMaxBid(getUserMaxBid);
        }
    },[user]);

    function showBidErrorMessage(message)
    {
        updateBidErrorMessage(message);
        setTimeout(()=>{
            updateBidErrorMessage("");
        },2000);
    }

    const enterBid = () => {
        if(!bidAmount){
            showBidErrorMessage("Bid Amount should be greater than the highest bid amount");
            return;
        }
        else if(productInfo["maxBidAmountForThisProduct"]){
            if(productInfo["maxBidAmountForThisProduct"] > bidAmount){
                showBidErrorMessage("Bid Amount should be greater than the highest bid amount");
                return;
            }
            if(productInfo["maxBidAmountForThisProduct"] + 5 > bidAmount){
                showBidErrorMessage("Bid Amount should be greater than the highest bid amount by atleast 5 SGD");
                return;
            }
        }
        else if(productInfo["productBasePrice"] > bidAmount){
            showBidErrorMessage("Bid Amount should be greater than the base price of the product");
            return;
        }
        let params = {
            "productId": productInfo["productId"],
            "currentBidAmount": bidAmount,
            "userId": user["userId"]
        };
        httpPost("/bid",params).then((response) => {
            console.log(response);
            showBidErrorMessage("Bid Raised Successfully");
        }, (error) => {
            console.log(error);
            showBidErrorMessage("Raise Bid Failed");
        });
    }

    useEffect( () => {

        if(productStatus == "ongoing"){
            const client = new Client({
                brokerURL: 'wss://b-000f8078-6ecc-4ff6-856f-1cfcefb36915-1.mq.ap-southeast-1.amazonaws.com:61619',
                connectHeaders: {
                login: 'auctionator',
                passcode: 'auctionatoradmin',
                },
                debug: function (str) {
                console.log(str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });
            client.onConnect = function (frame) {
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
                console.log("Connected...");
                    let subscription = client.subscribe(`/topic/${productInfo["productId"]}`, (message)=>{
                        console.log("bid info : ");
                        console.log(message.body);
                });
            };
            client.onStompError = function (frame) {
                // Will be invoked in case of error encountered at Broker
                // Bad login/passcode typically will cause an error
                // Complaint brokers will set `message` header with a brief message. Body may contain details.
                // Compliant brokers will terminate the connection after any error
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            };
            
            client.activate();
            return function () { 
                console.log("Terminating subscriptions....");
                client.deactivate();
            }
        }
    },[productStatus]);

    useEffect(async ()=>{

        return ()=>{
            console.log("unmounting...");
        }
    },[])

    return (
        <div>
            {
                showValuationToolModal && 
                <ValuationTool onModalClose = {onModalClose}></ValuationTool>
            }
            <StickyHeader></StickyHeader>
            <div className={styles.productDetailsContainer}>
                <div className={styles.productDetailsBox}>
                    <div className={styles.row1}>
                        <div className={styles.imageContainer}>
                            <img src={productInfo["productImageUrl"]} height="400" width="400"></img>
                        </div>
                        <div className={styles.productDescription}>
                            <div className={styles.productName}>{productInfo["productName"]}</div>
                            <div className={styles.productStatus} style={{backgroundColor : productStatus == "upcoming" ?  '#1565c0' :  '#4caf50'}}>{productStatus.toUpperCase()}</div>
                            <div className={styles.productPriceContainer}>
                                <div className={styles.priceHeader}>Base Price</div>
                                <div className={styles.priceValue}>{`$ ${productInfo["productBasePrice"]}`}</div>
                                <div className={styles.priceHeader}>Highest Bid Amount</div>
                                <div className={styles.priceValue}>{`$ ${productInfo["maxBidAmountForThisProduct"] ? productInfo["maxBidAmountForThisProduct"]  : '0'}`}</div>
                                { user && userMaxBix && <div className={styles.priceHeader}>Your Highest Bid Amount</div>}
                                { user && userMaxBix && <div className={styles.priceValue}>{`$ ${userMaxBix}`}</div>}
                                { productInfo["categoryId"] == "ff8080817871d14e017871d362460003" && <div className={styles.priceHeader}>AI Valutation tool Quote</div>}
                                { productInfo["categoryId"] == "ff8080817871d14e017871d362460003" && <div className={styles.priceValue}>$56,000</div>}
                                <div className={styles.priceHeader}>Number of Bids</div>
                                <div className={styles.priceValue}>{productInfo["numberOfBids"]}</div>
                            </div>
                            <div onClick={openValuationToolModal} className={styles.aiValuationTool}>
                                AI Valuation tool
                            </div>
                            <div className={styles.timerContainer}>
                                <div className={styles.startTime}>
                                    <span className={styles.lhs}>Start Time : </span>
                                    <span className={styles.rhs}>{new Date(productInfo["startTime"]).toLocaleString()}</span>
                                </div>
                                <div className={styles.startTime}>
                                    <span className={styles.lhs}>End Time : </span>
                                    <span className={styles.rhs}>{new Date(productInfo["endTime"]).toLocaleString()}</span>
                                </div>
                                <div className={styles.timerBox} style={{backgroundColor : productStatus == "upcoming" ?  '#1565c0' :  '#4caf50'}}>
                                    <div className={styles.timerText} >{productStatus == 'ongoing' ? <span>Remaining Time Left</span> : <span>Time Left to Start</span>}</div>
                                    <div className={styles.timerTime}>{timeLeft}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.row2}>
                        <div className={styles.userContainer}>
                            { sellerInfo != null && 
                            <div className={styles.sellerContainer}>
                                <div className={styles.sellerInfo}>Seller Info</div>
                                <div className={styles.sellerBox}>
                                    <div className={styles.sellerBoxItem}>Seller Name</div>
                                    <div className={styles.sellerBoxItem}>{sellerInfo["userName"]}</div>
                                    <div className={styles.sellerBoxItem}>Seller Email</div>
                                    <div className={styles.sellerBoxItem}>{sellerInfo["userEmail"]}</div>  
                                    <div className={styles.sellerBoxItem}>Seller Address</div>
                                    <div className={styles.sellerBoxItem}>{sellerInfo["userAddress"]}</div>
                                </div>
                            </div>}
                        </div>
                        <div className={styles.productDetails}>
                            {
                                Object.keys(productInfo["productDetails"]).map((key, index) => {
                                    return (
                                        <div key={key} className={styles.productDetailTile} style={{ backgroundColor : index % 2==0 ? '#dadada' : 'white'}}>
                                            <div className={styles.productDetailTileTextLHS}>{key}</div>
                                            <div className={styles.productDetailTileTextRHS}>{productInfo["productDetails"][key]}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    {
                        productStatus == "ongoing" &&
                        <div className={styles.row3}>
                            <div className={styles.bidTextField}>
                                <TextField value={bidAmount} onChange={(e) => updateBidAmount(e.target.value)} disabled={user==null} id="outlined-basic" label="Enter Bid Amount" variant="outlined" />
                            </div>
                            <div className={styles.bidButtonField}>
                                <Button onClick={enterBid} disabled={user==null} variant="contained" color="primary" style={{color: 'white'}}>BID</Button>
                            </div>
                            <div>
                                {bidErrorMessage}
                            </div>
                        </div>
                    }

                </div>
                <div className={styles.carousellContainer} >
                    <ProductsCarousell timerExpiryCallback={handleUpcomingEventsTimerExpiry} status="upcoming" products={upcomingBidding} title="Upcoming Biddings"></ProductsCarousell>
                </div>
                <div className={styles.carousellContainer} >
                    <ProductsCarousell timerExpiryCallback={handleOngoingEventsTimerExpiry} status="ongoing" products={ongoingBidding} title="Ongoing Biddings"></ProductsCarousell>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    try{
        let query = context.query;
        let url = `/product/${query.pid}`;
        let result = await Promise.all([
            httpGet(url, {}, {}),
            httpGet("/product/all?pageNumber=0&pageSize=10&statuses=Upcoming",{},{}),
            httpGet("/product/all?pageNumber=0&pageSize=10&statuses=Ongoing",{},{})
        ])
        return {
            props : {
                productInfo : result[0],
                upcoming: result[1],
                ongoing: result[2]
            }
        }
    }catch(e){
        console.log(e);
        return {
            props : {
                err : "Error Occurred While Retrieving Product Info"
            }
        }
    }
    
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(ProductDetails);