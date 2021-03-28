import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FriendsIcon from "@material-ui/icons/GroupAdd";
import MoreIcon from "@material-ui/icons/MoreVert";
import { useHistory, useLocation } from "react-router-dom";
import FilterListIcon from "@material-ui/icons/FilterList";
import { AccountCircle } from "@material-ui/icons";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
// import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

// let sock = io.connect(`http://${config.SERVER_HOST}:${config.SERVER_PORT}`);

export default function PrimarySearchAppBar(props) {
  // let [length, setlength] = useState(0);
  let location = useLocation();
  const [information, changeIformation] = useState({
    image: [],
  });

  useEffect(() => {
    let ALLimage = [];
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/images?login=" + localStorage.getItem("login"), {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success) {
          respond.data.data.forEach((element) => {
            ALLimage.push("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + config.SERVER_IMGS + element.image_path);
          });
          changeIformation((oldvalue) => ({ ...oldvalue, image: ALLimage }));
        }
      });

    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications?limit=0", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
        if (respond.data.success)
          props.setlength(respond.data.data[0] !== undefined ? respond.data.invue_length : 0);
      });// eslint-disable-next-line
  }, []);
  

  let vuenotifications = () => {
    props.setlength(0);
    axios
      .get("http://" + config.SERVER_HOST + ":" + config.SERVER_PORT + "/notifications/vue", {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((respond) => {
      });
  };

  let history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const login = localStorage.getItem("login");
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <a style={{ textDecoration: "none" }} href={"/EditProfil/" + login}>
          Profile
        </a>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <a style={{ textDecoration: "none" }} href="/History">
          History
        </a>
      </MenuItem>
      <MenuItem
        onClick={() => {
          localStorage.removeItem("Authorization");
          localStorage.removeItem("login");
          window.location.href = "/Singin";
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <MailIcon
              onClick={() => {
                history.push("/message");
              }}
            />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={props.length} color="secondary">
            <NotificationsIcon
              onClick={() => {
                vuenotifications();
                history.push("/notification");
              }}
            />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 7 new Friends" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <FriendsIcon
              onClick={() => {
                history.push("/Freinds");
              }}
            />
          </Badge>
        </IconButton>
        <p>Freinds</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
          {/* eslint-disable-next-line */}
          {!information.image || information.image.length == 0 ? (
            <AccountCircle />
          ) : (
            <img
              src={information.image[0]}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="profile"
            />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ backgroundColor: "#915ACE" }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/" style={{ textDecoration: "none" , color : 'black'}}>
              MATCHA
            </Link>
          </Typography>
          {location.pathname === "/" ? (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={props.searchString}
                onChange={(event) => props.setSearchString(event.target.value)}
                inputProps={{ "aria-label": "search" }}
              />
              <FilterListIcon
                onClick={() => {
                  props.filter === 1 ? props.filtring(0) : props.filtring(1);
                }}
                id="filter"
                style={{ position: "absolute", right: "10px", bottom: "6px" }}
              />
            </div>
          ) : null}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <MailIcon
                  onClick={() => {
                    history.push("/message");
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={props.length} color="secondary">
                <NotificationsIcon
                  onClick={() => {
                    vuenotifications();
                    history.push("/notification");
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 7 new Friends" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <FriendsIcon
                  onClick={() => {
                    history.push("/Freinds");
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
              {/* eslint-disable-next-line */}
              {!information.image || information.image.length == 0 ? (
                <AccountCircle />
              ) : (
                <img
                  src={information.image[0]}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt=" profile"
                />
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
