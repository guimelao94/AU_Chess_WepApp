/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
// core components

import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle.js";

import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Icon, InputLabel, MenuItem, Select, Slide } from "@material-ui/core";
import { Close, GroupWork, Message } from "@material-ui/icons";
import GridContainer from "components/Grid/GridContainer";
import Parallax from "components/Parallax/Parallax";
import landing from "assets/img/landing.png";
import fire from "Fire"
import { classicNameResolver } from "typescript";
const useStyles = makeStyles(signupPageStyle);

export const  SignUpPage = ({ ...rest }) => {
  const [skillLevel, setSkillLevel] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [studentID, setStudentID] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const handleSimple = event => {
    setSkillLevel(event.target.value);
  };
  const handleSubmit = () => {
    let db = fire.firestore();
    db.collection("signups").doc(fullName).set(
      {
        "Full Name":fullName,
        "Phone Number":phoneNumber,
        "Email Address":emailAddress,
        "Student ID":studentID,
        "Skill Level":skillLevel
    });
    
    setLiveDemo(true);
  }
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  const [liveDemo, setLiveDemo] = React.useState(false);

  const classes = useStyles();
  return (
    <div
    style={{
      maxWidth:"600px",
      marginTop:"auto",
      marginBottom:"auto",
      marginRight:"auto",
      marginLeft:"auto"
    }}
  >
    <div style={{ 
      backgroundImage:"url("+landing+")",
      backgroundSize:"cover"
    }} 
    >
      <Button
                style={{         
                  position:"absolute",
                  top:"10px",
                  left:"10px",
                  zIndex:"5000"
                }}
                round
                color="gray"
                size="lg"
                href="/"
              >
                <i className="fas fa-arrow-circle-left"></i>
              </Button>
      <GridContainer justify="center" style={{paddingTop:"33px"}}>
            <GridItem xs={11} sm={10} md={10}>
              <Card >
                <h2 className={classes.cardTitle}>Sign Up</h2>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} >
                      <form className={classes.form}>
                      <CustomInput
                        labelText="Full Name"
                        id="float"
                        value={fullName}
                        onChange={(e)=>{
                          setFullName(e.target.value);
                        }}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      <CustomInput
                        labelText="Email Address"
                        id="float"
                        value={phoneNumber}
                        onChange={(e)=>setPhoneNumber(e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      <CustomInput
                        labelText="Phone Number"
                        id="float"
                        value={emailAddress}
                        onChange={(e)=>setEmailAddress(e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                      <CustomInput
                        labelText="Student ID"
                        id="float"
                        value={studentID}
                        onChange={(e)=>setStudentID(e.target.value)}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    <FormControl fullWidth className={classes.customStyleSelect}>
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Skill Level
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.customStyleSelect
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={skillLevel}
                        onChange={handleSimple}
                        inputProps={{
                          name: "simpleSelect",
                          id: "simple-select"
                        }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="I want to learn"
                        >
                          I want to learn
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="Beginner"
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="Intermediate"
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="Advanced"
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                        <div 
                          className={classes.textCenter}
                          style={{marginTop:"2em"}}
                        >
                          <Button 
                            color="gray" 
                            style={{fontSize:"1.5em"}}
                            onClick={handleSubmit}
                          >
                            Sumbit
                          </Button>
                        </div>
                      </form>
                    </GridItem>
                    <GridItem xs={12} md={6}>
                      <InfoArea
                        className={classes.infoArea}
                        title="Discord"
                        description="We've created a Discord server which we use for instant messaging and announcements. This will be the main way of communicating in the club."
                        icon={Message}
                        iconColor="warning"
                      />
                    </GridItem>
                    <GridItem xs={12} md={6}>
                      <InfoArea
                          className={classes.infoArea}
                          title="Grow Group"
                          description="Join our Grow Group to receive co-curricular credit."
                          icon={GroupWork}
                          iconColor="danger"
                        />
                    </GridItem>
                    
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>

          <Dialog
              classes={{
                root: classes.modalRoot,
                paper: classes.modal + " " + classes.modalLarge
              }}
              open={liveDemo}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setLiveDemo(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <Button
                  simple
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  onClick={() => setLiveDemo(false)}
                >
                  {" "}
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Sign Up Confirmation</h4>
              </DialogTitle>
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <p>Woohoo, you're in! Make sure to join our Discord server to get the latest announcements from the club, and register for our Grow Group to receive co-curricular.</p>
              </DialogContent>
              <DialogActions className={classes.modalFooter}>
                <Button onClick={() => setLiveDemo(false)} href="https://churchteams.com/m/Register.asp?a=MThGZzJLQ0FnSnc9" color="warning">
                  Grow Group
                </Button>
                <Button color="gray" 
                href="https://discord.gg/eS2uJNZs3t"
                >
                  Join Discord
                  </Button>
              </DialogActions>
            </Dialog>
    
        
    </div>
</div>
  );
}

