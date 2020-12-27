import React from "react";
import { useState }from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

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


const Contacts = (props) => {
  const users = props.users[0];
  const classes = useStyles();
  const [contacts, setContacts] = useState(props.users[0])
  const filterContacts = (e) => {
      let con = users.filter(user => user.username.toLowerCase().includes(e.target.value.toLowerCase()))
      setContacts(con)
  }
let x = []
if (users) {x = users}
if (contacts) {x = contacts}
  return (
    <div>
      <form>
        <input style={{width: "100%", padding: "0.5em"}} placeholder="Search people..." onChange={filterContacts} type="input"/>
      </form>
      { x ? (
         x.map((user, i) => {
          return (
            <List onClick={() => props.sendId(user.username)} key={i} className={classes.root}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={user.username}
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
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
                        Online
                      </Typography>
                      {""}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          );
        })
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default Contacts;
