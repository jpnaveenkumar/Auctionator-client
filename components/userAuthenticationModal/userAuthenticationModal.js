import styles from './userAuthenticationModal.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import {useEffect, useState} from 'react';
import {httpPost} from '../../library/httpRequest';
import { connect } from 'react-redux';
function userAuthenticationModal({onModalClose, dispatch}){


    const [showAlert, updateShowAlert] = useState(false);
    const [alertMessage, updateAlertMessage] = useState("");
    const [alertSeverity, updateAlertSeverity] = useState("warning");
    const [isButtonLoading, updateButtonLoading] = useState(false);

    const [activeTab, updateActiveTab] = useState(0);
    const [signupUsername, updatesignupUsername] = useState("");
    const [signupEmailId, updateEmailId] = useState("");
    const [signupAddress, updateAddress] = useState("");
    const [signupPassword, updatePassword] = useState("");
    const [signupConfirmPassword, updateConfirmPassword] = useState("");
    const [signupPhoneNumber, updatePhoneNumber] = useState("");
    
    const [loginEmailId, updateLoginEmailId] = useState("");
    const [loginPassword, updateLoginPassword] = useState("");
    
    function getWindowHeight(){
        return window.innerHeight;
    }

    function closeModal(e){
        if(e.target.id == "overlay"){
            onModalClose();
        }
    }

    function updateTab(value){
        if(value != activeTab){
            updateActiveTab(value);
        }
    }

    function showMessage(severity, message){
        updateAlertMessage(message);
        updateAlertSeverity(severity);
        updateShowAlert(true);
        setTimeout(()=>{
            updateShowAlert(false);
        },2000);
    }

    function userLogin()
    {
        if(!loginEmailId){
            showMessage("error", "Missing EmailId in the Login form");
            return;
        }
        if(!loginPassword){
            showMessage("error", "Missing Password in the Login form");
            return;
        }
        var params = {
            email: loginEmailId,
            password: loginPassword
        }
        updateButtonLoading(true);
        httpPost("/login/",params).then((response) => {
            console.log(response);
            showMessage("success", "Login Successful");
            dispatch({
                "type" : "setUser",
                "user" : response,
            });
            updateButtonLoading(false);
            onModalClose();
        }, (error) => {
            console.log(error);
            showMessage("error", "Invalid credentials. Please try again.");
            updateButtonLoading(false);
        });
    }

    function userSignUp()
    {
        if(!signupUsername){
            showMessage("error", "Missing Username in the Signup form");
            return;
        }
        if(!signupEmailId){
            showMessage("error", "Missing EmailId in the Signup form");
            return;
        }
        if(!signupPassword){
            showMessage("error", "Missing Password in the Signup form");
            return;
        }
        if(!signupPhoneNumber){
            showMessage("error", "Missing phone number in the Signup form");
            return;
        }
        if(!signupAddress){
            showMessage("error", "Missing Address in the Signup form");
            return;
        }
        if(signupPassword != signupConfirmPassword){
            showMessage("error", "password and confirm password do not match");
            return;
        }
        var params = {
            userName: signupUsername,
            userAddress: signupAddress,
            userEmail: signupEmailId,
            userPassword: signupPassword,
            userPhoneNumber: signupPhoneNumber 
          }
          updateButtonLoading(true);
          httpPost("/user/signup",params).then((response) => {
            console.log(response);
            showMessage("success", "You have successfully registered. Please sign in to continue.");
            updateButtonLoading(false);
            onModalClose();
          }, (error) => {
            console.log(error);
            showMessage("error", "The Email ID has already been registered. Please sign in to continue.");
            updateButtonLoading(false);
          });

    }

    const [overlayHeight, updateOverlayHeight] = useState(getWindowHeight());
    return (
            <div id="overlay" onClick={closeModal} className={styles.overlay} style={{height:overlayHeight}}>
                <div className={styles.alert}>
                    { showAlert && <Alert severity={alertSeverity}>
                        {alertMessage}
                    </Alert>}
                </div>
                <div className={styles.modal}>
                    <div className={styles.tabs}>
                        <div onClick={() => updateTab(0)} className={`${styles.tab} ${activeTab == 0 ? styles.activeTab : styles.disabledTab}`}>
                            Signup 
                        </div>
                        <div onClick={() => updateTab(1)} className={`${styles.tab} ${activeTab == 1 ? styles.activeTab : styles.disabledTab}`}>
                            Login
                        </div>
                    </div>
                    <div className={styles.tabContent}>
                        {
                            activeTab == 0 ? 
                            (
                                <div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updatesignupUsername(e.target.value)} value={signupUsername} style ={{width: '90%'}} size="small" label="Username" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updateEmailId(e.target.value)} value={signupEmailId} style ={{width: '90%'}} size="small" label="Email Id" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updateAddress(e.target.value)} value={signupAddress} style ={{width: '90%'}} size="small" label="Address" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updatePhoneNumber(e.target.value)} value={signupPhoneNumber} style ={{width: '90%'}} size="small" label="Phone Number" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updatePassword(e.target.value)} value={signupPassword} style ={{width: '90%'}} size="small" type="password" label="Password" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updateConfirmPassword(e.target.value)} value={signupConfirmPassword} style ={{width: '90%'}} size="small" type="password" label="Confirm Password" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <Button onClick={userSignUp} style ={{width: '60%'}} size="large" variant="contained" color="primary" disabled={isButtonLoading}>
                                            Signup
                                        </Button>
                                    </div>
                                </div>
                            ) : 
                            (
                                <div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updateLoginEmailId(e.target.value)} value={loginEmailId} style ={{width: '90%'}} size="small" label="Email Id" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <TextField onChange={(e) => updateLoginPassword(e.target.value)} value={loginPassword} style ={{width: '90%'}} size="small" type="password" label="Password" variant="outlined" />
                                    </div>
                                    <div className={styles.inputField}>
                                        <Button  onClick={userLogin} style ={{width: '60%'}} size="large" variant="contained" color="primary" disabled={isButtonLoading}>
                                            Login
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
    );
}

export default connect()(userAuthenticationModal)