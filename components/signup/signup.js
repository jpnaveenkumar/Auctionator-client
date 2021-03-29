import React, {useRef} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton, InputAdornment } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import {httpPost} from '../../library/httpRequest';


const useStyles = makeStyles((theme) => ({
  paper: {
   marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#023e8a',
    fontSize: '15px',
    fontWeight: 'bold',
    textTransform: 'none'
  },
  error: {
    color : 'red'
  },
  textField: {
    fontSize:'14px'
  }
}));

export default function SignUp() {

  const classes = useStyles();
  const { handleSubmit, register, errors, watch } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoader] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [validationMessage, setValidationMessage] = React.useState("");
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }  
  const password = useRef({});
  password.current = watch("password", "");

  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

 

  const onSubmit = values => {
    setValidationMessage("");
    setLoader(true);    var params = {
      userName: values.firstName + values.lastName,
      userAddress: values.address,
      userEmail: values.email,
      userPassword: values.password
    }
    httpPost("/user/signup",params).then((response) => {
      console.log(response);
      setValidationMessage("You have successfully registered. Please sign in to continue.");
      setLoader(false);
    }, (error) => {
      console.log(error);
      setValidationMessage("The Email ID has already been registered. Please sign in to continue.");
      setLoader(false);
    });
  }

    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}> 
        <div>   
          {validationMessage != "" && (
              <span className={classes.error}>{validationMessage}</span>
          )} 
        </div>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="off"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                inputRef={register({
                  required: 'First Name required',
                  minLength: {
                    value: 6,
                    message: 'First name must contain a minimum of 6 characters',
                  }
                })}
                InputProps={{
                  classes: {
                    input: classes.textField,
                  },
                }}
              />
               {errors.firstName && (
                    <span className={classes.error}>{errors.firstName.message}</span>
                )}    
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="off"
                inputRef={register({
                  required: 'Last Name required',
                })}
                InputProps={{
                  classes: {
                    input: classes.textField,
                  },
                }}
              />
              {errors.lastName && (
                    <span className={classes.error}>{errors.lastName.message}</span>
                )} 
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="off"
                autoCorrect = 'off'
                inputRef={register({
                  required: 'Address required',
                })}
                InputProps={{
                  classes: {
                    input: classes.textField,
                  },
                }}
              />
              {errors.address && (
                    <span className={classes.error}>{errors.address.message}</span>
                )} 
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email ID"
                name="email"
                autoComplete = 'off'
                autoCorrect = 'off'
                inputRef={register({
                    required: 'Email ID required',
                    pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Please enter a valid email address'
                    },
                  })}        
                  InputProps={{
                    classes: {
                      input: classes.textField,
                    },
                  }}     
                   />
                    {errors.email && (
                    <span className={classes.error}>{errors.email.message}</span>
                  )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                inputRef={register({
                  required: 'Password required',
                  minLength: {
                    value: 8,
                    message: 'Password must contain a minimum of 8 characters',
                  },
                })} 
                InputProps={{ 
                  classes: {
                    input: classes.textField,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )}}
              />
               {errors.password && (
                    <span className={classes.error}>{errors.password.message}</span>
                )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                inputRef={register({
                  required: 'Confirm password required',
                  validate: value =>
                    value === password.current || "The passwords do not match"
                })} 
                InputProps={{ 
                  classes: {
                    input: classes.textField,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )}}
              />
               {errors.confirmPassword && (
                    <span className={classes.error}>{errors.confirmPassword.message}</span>
                )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled = {loading}
          >
            Sign Up
            {loading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          </Button>
        </form>
      </div>
    </Container>
    ); 
}
