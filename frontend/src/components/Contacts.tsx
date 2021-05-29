import React, { useEffect, useState } from "react";
import axios from "axios";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
      cursor: "pointer",
    },
    inline: {
      display: "inline",
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const Contacts = (props) => {
  const users = props.users[0];
  const classes = useStyles();
  const [contacts, setContacts] = useState(props.users[0]);
  const [user1, setUser] = useState("");
  const [friend, setFriend] = useState("");
  const [x, setX] = useState([]);
  const [open, setOpen] = useState(false);
  const filterContacts = (e) => {
    let con =
      users &&
      users.filter((user) =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
    setContacts(con);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (username, friend) => {
    setUser(username)
    setFriend(friend)
    setOpen(true);
  };

  const removeFriend = () => {
    handleClose()
    axios.post(`http://localhost:8080/deleteFriend/${user1}/${friend}`)
    .then((res) => {
      props.getUsers()
      props.getContacts(props.user.Username)
      // let filtered = getFiltered()
      // filtered && setX(filtered)
    }).catch(err => console.log(err))
  };

  useEffect(() => {
    let filtered = users && users.filter((user) => user.username !== props.user.Username);
    filtered && setX(filtered);
    contacts && setX(contacts);
  }, [users, contacts]);
  return (
    <div>
      <form>
        <input
          id="searchbar"
          style={{ width: "100%", padding: "0.5em" }}
          placeholder={props.placeholder}
          onChange={filterContacts}
          type="input"
        />
      </form>
      {x ? (
        x.map((user, i) => {
          return (
              <List
                onClick={() => props.sendId(user.username)}
                key={i}
                className={classes.root}
              >
                <ListItem alignItems="flex-start">
                    { user.profileimg
                     ? 
                  <ListItemAvatar>
                     <Avatar
                      alt={user.username}
                      src={`./files/${user.profileimg}`}
                    />
                    
                  </ListItemAvatar> 
                  :
                  <ListItemAvatar>
                    <Avatar
                    alt={user.username}
                    src="logo192.png"
                   />
                   </ListItemAvatar> }
                  <ListItemText
                    primary={user.username}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {user.username === props.user.Username &&
                          props.user.Authenticated ? (
                            <span>Online</span>
                          ) : (
                            <span>Offline</span>
                          )}
                        </Typography>
                        {""}
                      </React.Fragment>
                    }
                  />
                  {props.placeholder !== "Search contacts..." ? (
                    <IconButton style={{ justifyContent: "flex-start" }}>
                      <AddIcon color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleOpen(props.user.Username, user.username )}
                      style={{ justifyContent: "flex-start" }}
                    >
                      <RemoveIcon color="primary" />
                    </IconButton>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
          );
        })
      ) : (
        <div>Loading</div>
      )}
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">{"Are you sure you want to remove friend from your contacts?"}</DialogTitle>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    No
                  </Button>
                  <Button onClick={removeFriend} color="primary">
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
    </div>
  );
};

export default Contacts;
