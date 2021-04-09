import styles from './valuationTool.module.css';
import GuageMeter from '../GuageMeter/GuageMeter';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';  
const axios = require('axios');
export default function ValuationTool({onModalClose})
{
    function getWindowHeight(){
        return window.innerHeight;
    }

    function closeModal(e){
        if(e.target.id == "overlay"){
            onModalClose();
        }
    }

    function calcScore()
    {
        if(!carModelName){
            showMessage("warning", "Car Model Name is missing!!");
            return ;
        }
        let params = {
            "regDate" : regDate.toISOString().split("T")[0].split("-")[0],
            "owners" : noOfOwners,
            "model" : carModelName
        }
        updateButtonLoading(true);
        axios.get("http://auctionator-ml.us-east-1.elasticbeanstalk.com/api/v1/carvaluation", {
            params
        }).then(function(response){
            if(response.status == 200){
                let predictionResults = response["data"]["data"];
                if(parseFloat(predictionResults["accuracy"]) < 0.4){
                    updateShowLowPrecisionContainer(true);
                    updateShowPredictionContainer(false);
                }else{
                    updatePredictionResults(predictionResults);
                    updateShowLowPrecisionContainer(false);
                    updateShowPredictionContainer(true);
                }
            }else{
                showMessage("warning", "Something went wrong!!");
            }
            updateButtonLoading(false);
        }).catch(function(error){
            console.log(error);
            updateButtonLoading(false);
            showMessage("error", "Internal Error Occurred");
        });
    }

    const [showAlert, updateShowAlert] = useState(false);
    const [alertMessage, updateAlertMessage] = useState("");
    const [alertSeverity, updateAlertSeverity] = useState("warning");
    const [isButtonLoading, updateButtonLoading] = useState(false);

    function showMessage(severity, message){
        updateAlertMessage(message);
        updateAlertSeverity(severity);
        updateShowAlert(true);
        setTimeout(()=>{
            updateShowAlert(false);
        },2000);
    }

    const [carModelName, updateCarModelName] = useState("");
    const [noOfOwners, updateNoOfOwners] = useState(0);
    const [regDate, updateRegDate] = useState(new Date('2018-08-18'));
    const [overlayHeight, updateOverlayHeight] = useState(getWindowHeight());
    const [predictionResults, updatePredictionResults] = useState({});
    const [showPredictionContainer, updateShowPredictionContainer] = useState(false);
    const [showLowPrecisionContainer, updateShowLowPrecisionContainer] = useState(false);
    
    return (
        <div id="overlay" onClick={closeModal} className={styles.overlay} style={{height:overlayHeight}}>
            <div className={styles.alert}>
                    { showAlert && <Alert severity={alertSeverity}>
                        {alertMessage}
                    </Alert>}
                </div>
            <div className={styles.modal}>
                <div className={styles.heading}>
                    AI Valuation Tool
                </div>
                <div className={styles.inputHolder}>
                    <div className={styles.inputField}>
                        <TextField onChange={(e) => updateCarModelName(e.target.value)} value={carModelName} style ={{width: '90%'}} size="small" label="Car Model" />
                    </div>
                    <div className={styles.inputField}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker margin="normal" label="Car Registration Date" format="MM/dd/yyyy"
                                value={regDate} onChange={(e) => updateRegDate(e)} />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className={styles.inputField}>
                        <div>
                        <Typography id="discrete-slider" gutterBottom>
                            <span className={styles.numberOfOwners}>Number of Owners</span>
                        </Typography>
                        <Slider
                            defaultValue={0}
                            value={noOfOwners}
                            onChange = {(event, newValue) => updateNoOfOwners(newValue)}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                        />
                        </div>
                    </div>
                    <div className={styles.inputField}>
                        <Button onClick={calcScore} size="medium" variant="contained" color="primary" disabled={isButtonLoading}>
                            Valuate
                        </Button>
                    </div>
                </div>
                {
                    showPredictionContainer && 
                    <div className={styles.predictionResultsContainer}>
                        <div>
                            <GuageMeter radiusVal="50" percent={predictionResults["accuracy"] * 100}></GuageMeter>
                            <div className={styles.predictionText}> Prediction Confidence Level</div>
                        </div>
                        <div className={styles.predictedVal}>
                            <div className={styles.predictedPrice}>{`$ ${parseInt(predictionResults["price"])}`}</div>
                            <div className={styles.predictionText}> Predicted Car Valuation</div>
                        </div>
                    </div>
                }
                {   showLowPrecisionContainer && 
                    <div className={styles.LowPrecision}>
                        Low Precision in Prediction
                    </div>
                }
            </div>
        </div>
    );
}