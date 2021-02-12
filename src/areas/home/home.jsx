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
import landing from "assets/img/landing.png";

import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.js";
import { Search } from "@material-ui/icons";


const useStyles = makeStyles(landingPageStyle);

export const HomePage = () =>{
  return (
    <HomePageBox />
  );
}

export const  HomePageBox = ({ ...rest }) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
      
      <div 
        
      >
          <Header
            brand="AU Chess Club"
            color="info"
          />

        <div className={classes.container}
          style={{ 
            backgroundImage:"url("+landing+")",
            backgroundSize:"cover",
            minHeight:"92vh"
          }}
        >
          <GridContainer>

            <GridItem xs={12} style={{textAlign:"center",marginTop:"10.5em"}}>
              
              <Button
                style={{width:"100%",marginBottom:"2em"}}
                color="gray"
                size="lg"
                href="/signup"
              >
                <i className="fas fa-clipboard" />
                Club Sign Up
              </Button>
            <br/>
              <Button
                style={{width:"100%",marginBottom:"2em"}}
                color="warning"
                size="lg"
                href="https://churchteams.com/m/Register.asp?a=MThGZzJLQ0FnSnc9"
                target="_blank"
              >
                <i className="fas fa-users" />
                Grow Group Sign Up
              </Button>

              <Button
                style={{width:"100%",marginBottom:"2em"}}
                color="gray"
                size="lg"
                href="https://discord.gg/eS2uJNZs3t"
              >
                <i className="fab fa-discord" />
                Join Discord Server
              </Button>

              <Button
                style={{width:"100%",marginBottom:"2em"}}
                color="warning"
                size="lg"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
              >
                <i className="fas fa-hand-paper" />
                Attendance
              </Button>
            </GridItem>
            <GridItem xs={12} style={{textAlign:"center",marginTop:"8em"}}>
            <img
              style={{ height: "100px", display: "block",margin:"auto" }}
              className={classes.imgCardTop}
              src={require("assets/img/AU_Flogo_Blue.png")}
              alt="Card-img-cap"
            />
            </GridItem>
          </GridContainer>
        </div>
    </div>
  );
}
