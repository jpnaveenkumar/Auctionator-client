import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'; 
import { makeStyles } from '@material-ui/core/styles';
import SignUp from "../../components/signup/signup";
import SignIn from "../../components/signIn/signIn";
export default function Login() {
    
    const useStyles = makeStyles({
        root: {
            flexGrow: 1,
            width: '40vw',
            margin:'auto',
            minHeight: '95vh'
        },
        rootDiv: {
          height: '100%',
          marginTop: '10px',  
        }
        });
  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  function TabPanel(props) {
      const {value,index} = props;
      var Tag;
      if(index === 0) {
          Tag = SignUp;
      } else {
          Tag = SignIn;
      }
      return (
        value === index && <Tag />
      );
  }

return (
  <div className={classes.rootDiv}>
    <Paper className={classes.root} elevation = {5}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Sign Up">
        </Tab>
        <Tab label="Sign In" >
        </Tab>
      </Tabs>

      <TabPanel value={value} index={0}>SignUp</TabPanel>
      <TabPanel value={value} index={1}>SignIn</TabPanel>
    </Paper>
  </div>
  
    
);
}

