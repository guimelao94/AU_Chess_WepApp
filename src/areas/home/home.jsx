/*eslint-disable*/ import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.js";
import { Search } from "@material-ui/icons";


const useStyles = makeStyles(landingPageStyle);

export default function HomePage({ ...rest }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>
      
      <Parallax image={require("assets/img/landing.png")} 
        style={{
            height:"105vh"
        }}
      >
      <div 
        style={{
            position:"absolute",
            top:"0",
            textAlign:"center",
            color:"white",
            textShadow:"0px 1px 4px #00000078"
        }}
      >
          <h1>AU CHESS CLUB</h1>
      </div>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} style={{textAlign:"center"}}>
              
              <Button
                style={{width:"100%"}}
                color="danger"
                size="lg"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                target="_blank"
              >
                <i className="fas fa-clipboard" />
                Club Sign Up
              </Button>
            <hr/>
              <Button
                style={{width:"100%"}}
                color="warning"
                size="lg"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                target="_blank"
              >
                <i className="fas fa-users" />
                Grow Group Sign Up
              </Button>
              <hr/>
              <Button
                style={{width:"100%"}}
                color="primary"
                size="lg"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                target="_blank"
              >
                <i className="fab fa-discord" />
                Join Discord Server
              </Button>
              <hr/>
              <Button
                style={{width:"100%"}}
                color="rose"
                size="lg"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                target="_blank"
              >
                <i className="fas fa-hand-paper" />
                Attendance
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          
        </div>
      </div>
    </div>
  );
}
