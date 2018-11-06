import React, { Component } from 'react';
import {connect} from "react-redux";
import {
  checkAuthState,
  fetchConcernMessagesFromOurLand,
} from './actions';

import MessageDialog from './MessageDialog';


class MessageDialogSSR extends Component {
  componentWillMount() {
    const { checkAuthState, fetchConcernMessagesFromOurLand } = this.props;
    checkAuthState();
    fetchConcernMessagesFromOurLand();
  }

  render() {
    const { user, uuid } = this.props;
    let homeUrl = window.location.protocol + "//" + window.location.hostname;
    return (
      <React.Fragment>
        {user &&
         <MessageDialog
           uuid={uuid}
           open={true}
           openDialog={openDialog => this.openDialog = openDialog}
           ref={(messageDialog) => {this.messageDialog = messageDialog;}}
           closeDialog={() => {window.location.href = homeUrl;}}
         />
        }
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState:
      () => dispatch(checkAuthState()),
    fetchConcernMessagesFromOurLand:
      () => dispatch(fetchConcernMessagesFromOurLand()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageDialogSSR);
