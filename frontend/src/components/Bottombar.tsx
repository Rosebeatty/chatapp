import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Search from './Search'
import GTranslateIcon from '@material-ui/icons/GTranslate';
import SearchIcon from '@material-ui/icons/Search';
import  Translate from './Translate';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

type Anchor = 'top' | 'bottom';

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    bottom: false,
    search:false
  });

  const toggleDrawer = (anchor: Anchor, open: boolean, search: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open, search });
  };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    //   onClick={toggleDrawer(anchor, false)}
    //   onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* <List>
        {['Inbox'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
      <List>
        { state.search 
        ? <Search />
        : <Translate/> }
      </List>
    </div>
  );

  return (
    <div>
      {(['bottom'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <div style={{display:"flex", justifyContent:"space-around", flexDirection:"row", height:"2.8em", alignItems:"center",width:"12vw", paddingLeft:"1vw"}}>
          <SearchIcon style={{fontSize:"1.5em", color:"white", cursor:"pointer"}} onClick={toggleDrawer(anchor, true, true)}></SearchIcon>
          <GTranslateIcon style={{fontSize:"1.5em", color:"white", cursor:"pointer"}} onClick={toggleDrawer(anchor, true, false)}></GTranslateIcon>
          </div>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false, false)}
            onOpen={toggleDrawer(anchor, true, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
