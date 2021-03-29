import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton, InputAdornment } from '@material-ui/core';
import {httpPost} from '../../library/httpRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(7),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor:  '#023e8a'
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(3),
      fontSize: '14px'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: '#023e8a',
      fontSize: '15px',
      fontWeight: 'bold',
      textTransform: 'none'
    },
    error: {
        color : 'red',
        alignSelf: 'baseLine'
    },
    textField: {
      fontSize:'14px'
    }
  }));

  const initialState = {
    userEmail: '',
    token: ''
}

function userDetailsReducer(state=initialState,action) {
  switch(action.type) {
    case 'update_loggedIn_user_details':
      return {
        ...state,
        userEmail: action.payload.userEmail,
        token: action.payload.token
      }
      default:
        return state
    
  }
}

const store = createStore(userDetailsReducer);



export default function SignIn() {

  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [validationMessage, setValidationMessage] = React.useState("");
  const [loading, setLoader] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = values => {
    setValidationMessage("");
    setLoader(true);
    var params = {
      email: values.email,
      password: values.password
    }
    httpPost("/login/",params).then((response) => {
      console.log(response);
      setValidationMessage("Login Successful");
      setLoader(false);

      var userData = {
        userEmail: values.email,
        token: response
      }

      store.dispatch({
        type: 'update_loggedIn_user_details',
        payload: userData
      })
    }, (error) => {
      console.log(error);
      setValidationMessage("Invalid credentials. Please try again.");
      setLoader(false);    
    });
  }  
  
    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {validationMessage != "" && (
            <span className={classes.error}>{validationMessage}</span>
        )} 
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                className={classes.textField}
                id="email"
                label="Email Address"
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
                    )
                  }}/>
                  {errors.password && (
                    <span className={classes.error}>{errors.password.message}</span>
                )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}>
            Sign In
            {loading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          </Button>
        </form>
      </div>
    </Container>
    ); 
}
