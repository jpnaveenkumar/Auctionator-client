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

const useStyles = makeStyles((theme) => ({
        textField: { 
            flexDirection: 'column',
            marginLeft: '20px'
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
        setImageName(files[0].name + ' uploaded');
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

    function handleOnSubmit() {

        if(!productName){
            showMessage("error", "Missing Product Name in the form");
            return;
        }
        if(!productBasePrice){
            showMessage("error", "Missing Product Base Price in the form");
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
                    productImageURL: imageURL,
                    productDetails: productObj
                }
                var setHeaders = {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'}
                httpPost("/product",productData,setHeaders).then((response) => {
                    updateButtonLoading(false);
                    console.log(response);
                    showMessage("success", "Product Added successfully");
                },
                (error) => {
                    updateButtonLoading(false);
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
                        {/* <AlertTitle>Warning</AlertTitle> */}
                        {alertMessage}
                    </Alert>}
                </div>
            <div className={styles.textField}>
                <TextField onChange={(e) => updateProductName(e.target.value)} className={classes.textField} size="small" label="Product Name" variant="outlined" />
            </div>
            
            <div className={styles.textField}>
                <TextField onChange={(e) => updateProductBasePrice(e.target.value)} className={classes.textField} size="small" label="Base Price" variant="outlined" />
            </div>
            
            <div className={styles.textField}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" onChange={(e) => updateCategoryId(e.target.value)}>
                    {category.map((category) => 
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </MenuItem>
                    )}    
                    </Select>
                </FormControl>
            </div>
    
            <div className={styles.textField}>
                <TextField className={classes.textField}
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
                <TextField className={classes.textField}
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
                <Button className={classes.upload} onClick={handleDialogOpen}>
                    Upload Image
                </Button>
                <DropzoneDialog
                        open={isDialogOpen}
                        onSave={handleSave}
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        showPreviews={true}
                        maxFileSize={5000000}
                        onClose={handleDialogClose}
                />
            </div>  
        </div>
        <div className={styles.featureDescription}>
            <div className={styles.featureDescriptionChild}>
                <div className={styles.dynamicFields}>
                    {createDynamicFields()}
                </div>
            </div>
            
                

            <div className={styles.submit} onClick={handleOnSubmit}>
                <Button className={classes.upload}>Submit</Button>
            </div>    
         </div> 
        </>
    )
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(AddProduct);