import styles from './valuationTool.module.css';
import GuageMeter from '../GuageMeter/GuageMeter';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';  
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

    const [carModelName, updateCarModelName] = useState("");
    const [noOfOwners, updateNoOfOwners] = useState(null);
    const [regDate, updateRegDate] = useState(new Date('2018-08-18'));
    const [overlayHeight, updateOverlayHeight] = useState(getWindowHeight());
    
    return (
        <div id="overlay" onClick={closeModal} className={styles.overlay} style={{height:overlayHeight}}>
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
                            // getAriaValueText={valuetext}
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
                        <Button  size="medium" variant="contained" color="primary">
                            Valuate
                        </Button>
                    </div>
                </div>
                {/* <GuageMeter radiusVal="50" percent="40"></GuageMeter> */}
            </div>
        </div>
    );
}