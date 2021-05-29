import * as React from "react";
import clsx from "clsx";
import {Link} from 'react-router-dom'
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Contacts from './Contacts'
import Menu from '@material-ui/core/Menu';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      // flexGrow: 1
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor:"#666DA3"
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
      },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "space-between",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

interface UserProps {
    users?: any,
    logout: () => any,
    sendId?: (id) => any,
    profile: boolean,
    user?: any,
    getUsers?: () => Promise<boolean>
    getContacts?: (username: string) => Promise<boolean>
}

const Sidebar: React.FC<UserProps> = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [add, setAdd] = React.useState(true);
  const [placeholder, setPlaceholder] = React.useState("Search contacts...")
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openit = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose()
    props.logout()
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const findFriends = () => {
    let searchbar = document.getElementById('searchbar')
    setTimeout(() => {
      setPlaceholder("Search everyone...")
    }, 400)
    searchbar.focus()
    props.getUsers()
    setAdd(false)
    
  }

  const showContacts = () => {
    let searchbar = document.getElementById('searchbar')
    setTimeout(() => {
      setPlaceholder("Search contacts...")
    }, 400)
    searchbar.focus()
    props.getContacts(props.user.Username)
    setAdd(true)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{width:"100vw"}}
      >
        <Toolbar>
          {!props.profile 
            ? <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
              <MenuIcon />
              </IconButton>
            : <a href="/" style={{cursor:"pointer", textDecoration:"none", color:"white"}}>Go back</a> }
          <Typography variant="h6"  className={classes.title}>
            <a href="/" style={{cursor:"pointer", textDecoration:"none", color:"white"}}>MEMO</a>
          </Typography>
          <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openit}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}><Link to={{pathname: "/profile"}}>Profile</Link></MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          {add ? 
            <IconButton style={{justifyContent: "flex-start"}} onClick={findFriends}>
              <AddIcon color="primary"/>
            </IconButton>
          : 
          <IconButton style={{justifyContent: "flex-start"}} onClick={showContacts}>
            <RemoveIcon color="primary"/>
          </IconButton>
          }
          <IconButton style={{justifyContent: "flex-end"}} onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
          {props.users ? <Contacts user={props.user.Username} {...props} placeholder={placeholder} sendId={props.sendId} users={props.users} /> : null}
      </Drawer>
      <main
        style={{ padding: "0" }}
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}

export default Sidebar