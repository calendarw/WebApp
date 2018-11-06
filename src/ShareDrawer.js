import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import purple from '@material-ui/core/colors/purple';

import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

const someNetwork = {
  verticalAlign: "top",
  display: "inline-block",
  marginRight: "1em",
  textAlign: "center",
};


const styles = theme => ({
  shareButton: {
    margin: 0,
    backgroundColor: purple[500],
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
  signButton: {
  fontWeight: 'bold',
  display: 'inline-block',
  margin: theme.spacing.unit,
  textAlign: 'center',
  color: 'white',
  backgroundColor: '#006eb9',
//   padding: '5px',
  border: '2px solid white',
  borderRadius: '2px',
  boxShadow: '0 0 0 3px #006eb9, 0 0 10px #aaa',
},
  avatar: {
    backgroundColor: red[500],
  },
  someNetwork: someNetwork,
  someNetworkShareCount: {
    color: 'white',
    marginLeft: '0.3em',
    fontSize: '1.0em',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  someNetworkShareButton: {
    cursor: "pointer",
  },
  facebook: {
    ...someNetwork,
  },
  container: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');

class ShareDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: false,
    };
  }


  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  facebookHashTag(tags) {
    var tagsLength = 0
    if(tags  != null ) {
      tagsLength = tags.length;
    }
    var tagString = '';
    for (var i = 0; i < tagsLength; i++) {
      tagString += "#"+tags[i] + " ";
    }
    //console.log("HashTag String:" + tagString);
    return tagString;

  }

  facebookQuote(message) {
/*
                "<meta property=\"og:title\"              content=\"" + message.text + "\" />" +
                "<meta property=\"og:description\"        content=\"Location"  +  "" + "\" />";
*/
    var quote = "";
    if(message  != null ) {
      quote = `【 ${message.status} 】 社區事件: ${message.text}`;

      if(message.streetAddress !== undefined && message.streetAddress  != null ) {
        quote += ` - 地點: ${message.streetAddress}`;
      }

      if(message.start !== undefined && message.start  != null ) {
        let date = message.start.toDate();
        if(date.getFullYear() > 1970) {
          let dateTimeString = '';
          dateTimeString = date.toLocaleDateString('zh-Hans-HK', { timeZone: 'Asia/Hong_Kong' });

          quote += ` - 開始日期: ${dateTimeString}`;
        }

      }
    }
    return quote;
  }

  renderEmail(shareUrl, m) {
    const {classes} = this.props;
    return (
      <div className={classes.someNetwork}>
        <EmailShareButton
          url={shareUrl}
          subject={m}
          body={shareUrl}
          className={classes.someNetworkShareButton}>
          <EmailIcon round size={'3.3em'} />
        </EmailShareButton>
      </div>
    );
  }

  renderWhatsapp(shareUrl, m) {
    const {classes} = this.props;
    return (
      <div className={classes.someNetwork}>
        <WhatsappShareButton
          url={shareUrl}
          title={m}
          separator=":: "
          className={classes.someNetworkShareButton}
        >
          <WhatsappIcon round size={'3.3em'} />
        </WhatsappShareButton>
      </div>
    );

  }

  renderFacebook(shareUrl, m, hashtag) {
    const {classes} = this.props;
    return (
      <div className={classes.facebook}>
        <FacebookShareButton
          url={shareUrl}
          quote={m}
          hashtag={hashtag}
          className={classes.someNetworkShareButton}>
          <FacebookIcon round size={'3.3em'} />
        </FacebookShareButton>
      </div>
    );

  }

  renderTelegram(shareUrl, m) {
    const {classes} = this.props;
    return (
      <div className={classes.telegram}>
        <TelegramShareButton
          url={shareUrl}
          title={m}
          className={classes.someNetworkShareButton}>
          <TelegramIcon round size={'3.3em'} />
        </TelegramShareButton>
      </div>
    );

  }



  render() {
    const { classes } = this.props;
    let m = "";
    let hashtag = "";
    let shareUrl = window.location.protocol + "//" + window.location.hostname;
    console.log(`message ${this.props.message} uid ${this.props.uid} book: ${this.props.bookmark}`);
    if(this.props.message !== undefined) {
      m = this.facebookQuote(this.props.message);
      hashtag = this.facebookHashTag(this.props.message.tag);
      shareUrl = shareUrl + "/detail/" + this.props.message.key;
    }
    if(this.props.uid !== undefined && this.props.displayName !== undefined && this.props.displayName !== "..." ){
      m = this.props.displayName;
      hashtag = "#我地";
      shareUrl = shareUrl + "/user/" + this.props.uid;
    }
    if(this.props.bookmark !== undefined) {
      m = this.props.bookmark.title;
      hashtag = "#我地";
      shareUrl = shareUrl + "/user/" + this.props.bookmark.uid + "/" + this.props.bookmark.key;
    }

    return (
      <span>
        <Button
          className={classes.signButton}
          onClick={this.toggleDrawer('bottom', true)}
        >
          <ShareIcon />
        </Button>
        <Drawer
          anchor="bottom"
          open={this.state.bottom}
          onClose={this.toggleDrawer('bottom', false)}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit">
                分享
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            tabIndex={0}
            role="button"
            className={classes.container}
            onClick={this.toggleDrawer('bottom', false)}
            onKeyDown={this.toggleDrawer('bottom', false)}
          >
            { this.renderFacebook(shareUrl, m, hashtag) }
            { this.renderWhatsapp(shareUrl, m) }
            { this.renderEmail(shareUrl, m) }
            { this.renderTelegram(shareUrl, m) }
          </div>
        </Drawer>
      </span>
    );
  }
}

ShareDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShareDrawer);
