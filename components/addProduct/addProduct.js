import styles from './addProduct.module.css';
import {useEffect, useState} from 'react';
import { TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
import {httpGet} from '../../library/httpRequest';
import Button  from '@material-ui/core/Button';
import {DropzoneDialog} from 'material-ui-dropzone';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import {httpPost} from '../../library/httpRequest';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { InputAdornment } from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme) => ({
        textField: { 
            flexDirection: 'column',
            marginLeft: '20px',
            width: '220px',
        },
        formControl: {
            minWidth: 120,
            marginLeft: '20px'
        },
        upload: {
            backgroundColor: '#023e8a',
            color: 'white',
            borderRadius: '5px',
            width: '120px',
            height: '45px',
            textTransform: 'none',
            marginLeft: '20px',
            "&:hover": {
                backgroundColor: '#023e8a'
            }
           
        },
        uploadBtn: {
            color: '#023e8a',
            backgroundColor: 'white',
            borderRadius: '5px',
            border: '1px solid #023e8a',
            width: '200px',
            height: '45px',
            "&:hover": {
                backgroundColor: '#023e8a',
                color: 'white',
            }
        }
      }));
      
function AddProduct({user}) {

    const classes = useStyles();

    const [category, getCategories] = useState([]);
    const [isDialogOpen, openNewDialog] = useState(false);
    const [imageName, setImageName] = useState("");
    
    const [uploadedImage, setUploadedImage] = useState([]);
   
   
    const [productName, updateProductName] = useState("");
    const [productBasePrice, updateProductBasePrice] = useState("");
    const [categoryId, updateCategoryId] = useState("");
    const [startTime, updateStartTime] = useState(new Date().toISOString().substring(0,16));
    const [endTime, updateEndTime] = useState(new Date().toISOString().substring(0,16));
    const [productObj, setProductObj] = useState({});
    const [productFeatures, updateProductFeatures] = useState([{}]);

    const [showAlert, updateShowAlert] = useState(false);
    const [alertMessage, updateAlertMessage] = useState("");
    const [alertSeverity, updateAlertSeverity] = useState("warning");
    const [isButtonLoading, updateButtonLoading] = useState(false);


    useEffect( async  ()=>{
        const categories = await httpGet(`/category/categories`,{},{});
        getCategories(categories);
    },[]);
    
    function showMessage(severity, message){
        updateAlertMessage(message);
        updateAlertSeverity(severity);
        updateShowAlert(true);
        setTimeout(()=>{
            updateShowAlert(false);
        },2000);
    }

    function handleDialogOpen() {
        openNewDialog(true);
    }
    function handleDialogClose() {
        openNewDialog(false);
    }
    function handleSave(files) {
        console.log(files);
        setImageName(files[0].name + ' ready to upload');
        openNewDialog(false);
        setUploadedImage(files[0]);
    }

    const addFeature = () => {
        updateProductFeatures([...productFeatures, {}]);
      };

    const removeFeature = index => {
        const list = [...productFeatures];
        list.splice(index, 1);
        updateProductFeatures(list);
    };

    const onChangeFeature = (e, index) => {
        const { name, value } = e.target;
        const list = [...productFeatures];
        list[index][name] = value;
        updateProductFeatures(list);
      };

    function createDynamicFields() {
        return productFeatures.map((el, i) => (
            <div key={i} className={styles.parentDynamicFieldDiv}>
               <TextField className={classes.textField} size="small" variant="outlined" placeholder="Feature" name="feature" value={el.feature ||''} onChange={e => onChangeFeature(e, i)} />
               <TextField className={classes.textField} size="small" variant="outlined" placeholder="Description" name="description" value={el.description ||''}  onChange={e => onChangeFeature(e, i)} />
               <div className={styles.IconButton}>
                {productFeatures.length !== 1 && 
                    <IconButton onClick={() => removeFeature(i)}>
                        <RemoveIcon />
                    </IconButton>}
                {productFeatures.length - 1 === i && 
                <IconButton  onClick={addFeature}>
                        <AddCircleOutlineIcon />
                    </IconButton>}
               </div>
               
            </div>          
          ))
    }

    function clearForm()
    {
        updateProductName("");
        updateProductBasePrice("");
        updateCategoryId("");   
        updateStartTime(new Date().toISOString().substring(0,16));
        updateEndTime(new Date().toISOString().substring(0,16));
        setImageName("");
        setUploadedImage([]);
        updateProductFeatures([{}]);
    }

    function handleOnSubmit() {

        if(!productName){
            showMessage("error", "Missing Product Name in the form");
            return;
        }
        if(!productBasePrice){
            showMessage("error", "Missing Product Base Price in the form");
            return;
        }
        if(!(!isNaN(parseFloat(productBasePrice)) && isFinite(productBasePrice) && productBasePrice > 0)){
            showMessage("error", "Enter valid Product Base Price");
            return;
        }
        if(!categoryId){
            showMessage("error", "Missing Category Name in the form");
            return;
        }
        if(uploadedImage.length == 0){
            showMessage("error", "Missing Image Upload in the form");
            return;
        }
        updateButtonLoading(true);
        productFeatures.map((ele,i) => {
           productObj[ele.feature] = ele.description; 
        })
        var bodyFormData = new FormData();
        bodyFormData.append('file', uploadedImage);
        var headers = {
            "Content-Type": "multipart/form-data"
        }
        showMessage("info", "Uploading Image Inprogress...");
            httpPost("/uploadImage",bodyFormData,headers).then((response) => {
                console.log(response);
                var imageURL = response.imageURL;
                var productData = {
                    productName : productName,
                    productBasePrice: parseFloat(productBasePrice),                    
                    categoryId: categoryId,
                    userId: user["userId"],
                    startTime: startTime,
                    endTime: endTime,
                    numberOfBids: 0,
                    productImageUrl: imageURL,
                    productDetails: productObj
                }
                var setHeaders = {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'}
                    showMessage("info", "Uploading Product Details Inprogress...");
                httpPost("/product",productData,setHeaders).then((response) => {
                    setTimeout(()=>{
                        showMessage("success", "Product Added successfully");
                    }, 1000);
                    updateButtonLoading(false);
                    clearForm();
                    console.log(response);
                },
                (error) => {
                    updateButtonLoading(false);
                    showMessage("error", "Failed to add product");
                    console.log(error);
                })
              }, (error) => {
                updateButtonLoading(false);
                showMessage("error", "Image Upload failed. Please try again");
              });
    }

    return (
        <>
        <div className={styles.addProductTitle}>
                Add Product
        </div>
        <div className={styles.parentDiv}>
                <div className={styles.alert}>
                    { showAlert && <Alert severity={alertSeverity}>
                        {alertMessage}
                    </Alert>}
                </div>
            <div className={styles.textField}>
                <TextField value={productName} onChange={(e) => updateProductName(e.target.value)} className={classes.textField} size="small" label="Product Name" variant="outlined" />
            </div>

            <div className={styles.textField}>
                <TextField className={classes.textField}
                value = {startTime}
                onChange={(e) => updateStartTime(e.target.value)}
                id="datetime-local"
                label="Starting Date and Time"
                type="datetime-local"
                defaultValue={startTime}
                InputLabelProps={{
                shrink: true,
                }} />
            </div>
            
            <div className={styles.textField}>
                <TextField  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AttachMoney style={{ fontSize: 20, color: 'grey' }} />
                        </InputAdornment>
                    ),
                    }} 
                    value = {productBasePrice}
                onChange={(e) => updateProductBasePrice(e.target.value)} className={classes.textField} size="small" label="Base Price" variant="outlined" />
            </div>

            <div className={styles.textField}>
                <TextField className={classes.textField}
                value = {endTime}
                onChange={(e) => updateEndTime(e.target.value)}
                id="datetime-local"
                label="Ending Date and Time"
                type="datetime-local"
                defaultValue={endTime}
                InputLabelProps={{
                shrink: true,
                }} />
            </div>
            
            <div className={styles.textField}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <InputLabel>Category</InputLabel>
                    <Select style={{minWidth: 200}} label="Category" value={categoryId} onChange={(e) => updateCategoryId(e.target.value)}>
                    {category.map((category) => 
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </MenuItem>
                    )}    
                    </Select>
                </FormControl>
            </div>
            
            <div className={styles.textField}>
                <Button className={classes.uploadBtn} onClick={handleDialogOpen}>
                    Upload Image
                </Button>
                <div className={styles.imageName}>{imageName}</div>
                <DropzoneDialog
                        open={isDialogOpen}
                        onSave={handleSave}
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        showPreviews={true}
                        maxFileSize={5000000}
                        onClose={handleDialogClose}
                />
            </div>  

            <div className={styles.dynamicFieldsContainer}>
                {createDynamicFields()}
            </div>
        </div>

        <div className={styles.submitContainer}>
            <div className={styles.submit} onClick={handleOnSubmit}>
                <Button disabled={isButtonLoading} className={classes.upload}>Submit</Button>
            </div>    
        </div>
        </>
    )
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(AddProduct);