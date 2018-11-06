
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PlayListPlayIcon from '@material-ui/icons/PlaylistPlay';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import MessageList from './MessageList';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import {connect} from "react-redux";
import { toggleEventListDialog, resetTagList } from './actions';
import FilterBar from './FilterBar';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}


const styles = {
    appBar: {
      position: 'relative',
      background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
    },
    flex: {
      flex: 1,
    },
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    }
  };

class EventListDialog extends React.Component {
  constructor(props) {
//    console.log("createEventListDialog");
    super(props);
    var messageIds = [];
    let invisible = false;
    if(this.props.invisible) {
      invisible = this.props.invisible;
    }
    if(this.props.messageIds  != null ) {  
      messageIds = this.props.messageIds;
    }
    var title = "EventList";
    if(this.props.title !== undefined) {
      title = this.props.title;
    }

    var userName = "";
    if(this.props.displayName !== undefined) {
      userName = this.props.displayName;
    }

    this.invisible = invisible;
    this.state = {
      messageIds: messageIds,
      title: title,
      userName: userName,
      open: false,
    };
  }

  handleRequestOpen(evt) {
    evt.preventDefault();
    if(this.state.messageIds.length > 0) {
        this.props.resetTagList(this.props.title);
        this.setState({open: true});
    }
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  renderMessages() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <MessageList
          disableLocationDrawer={true}
          isUsePublicAddressBook={false}
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={100}
          distance={10}
          messageIds={this.state.messageIds}
          id={this.props.title}
        />
      </div>
    );
  }


  render() {
    const { classes} = this.props;let messageHtml = null;let buttonHtml = null;
    let titleText = this.state.title + ": " + this.state.messageIds.length;
    let open = this.state.open; 
    if(open)  {
        messageHtml = this.renderMessages();
    }
    if(!this.invisible) {
      buttonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                      <ListItemIcon>
                        <PlayListPlayIcon/>
                          </ListItemIcon>
                        <ListItemText primary={titleText} />
                      </ListItem>;
    }
    return (
        <span>
            {buttonHtml}
            <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{this.state.userName} {this.state.title}</Typography>
                    </Toolbar>
                </AppBar>
                <FilterBar disableLocationDrawer={true} filterID={this.props.title}/>
                {messageHtml}
            </Dialog>
        </span>);
  }
}

EventListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleEventListDialog: flag => 
      dispatch(toggleEventListDialog(flag)),
    resetTagList: filterID =>
      dispatch(resetTagList(filterID)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EventListDialog));
