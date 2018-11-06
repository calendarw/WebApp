import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { constant } from '../config/default';
import {
  openSnackbar,
} from '../actions';
import {
  updatePollingResult
} from '../MessageDB';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
     flexGrow: 1,
     paddingTop: '20px',
     paddingBottom: '20px',
  },
  dialogTitle: {
    position: 'relative',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  pollingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  pollingTitle: {
    fontSize: '30px',
    fontWeight: 'bold'
  },
  dayLeft: {
    fontSize: '18px',
  },
  dayLeftContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaDataContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px'
  },
  pollingOption: {
    textAlign: 'center',
    width: '100%',
    padding: '11px 12px',
    borderRadius: '4px',
    border: '1px solid #eee',
    fontSize: '15px',
    display: 'block',
  },
  button: {
    width: '100%'
  },
  selected: {
    backgroundColor: 'green',
    color: 'white'
  }
});

class PollingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfMaxPollng: 0,
      selectedOption: [],
    }
  }

  componentDidMount() {
    const { polling } = this.props;
    this.setState({
      numOfMaxPollng: polling.numOfMaxPollng
    })
  }

  poll(evt, index) {
    const { selectedOption, numOfMaxPollng } = this.state;
    evt.preventDefault();

    let numOfPollng = numOfMaxPollng;
    let idx = selectedOption.indexOf(index);
    if(idx < 0) {
      if(numOfPollng === 0) {
        return this.props.openSnackbar(constant.excessNumOfPollingIndex, 'warning');
      }
      selectedOption.push(index);
      numOfPollng--;
    } else {
      numOfPollng++;
      selectedOption.splice(idx, 1);
    }

    this.setState({
      selectedOption,
      numOfMaxPollng: numOfPollng
    });
  }

  onSubmit() {
    const { selectedOption } = this.state;
    const { user, polling, messageUUID } = this.props;

    if(selectedOption.length > 0) {
      const pollingResult = {};
      for(var i=0; i<polling.pollingOptionValues.length; i++) {
        pollingResult[i] = selectedOption.indexOf(i) < 0 ? 0 : 1
      }
      let result = {
        uid: user.user.uid,
        value: pollingResult
      }
      updatePollingResult(messageUUID, result).then(() => {
        this.props.openSnackbar(constant.submitPollingSuccessLabel, 'success');
        this.setState({showPollingResult: true});
        this.props.handlePollingDialogCloseCallback();
      });
    }
  }

  render() {
    const { classes, polling } = this.props;
    const { numOfMaxPollng, selectedOption } = this.state;

    return (
      <Paper className={classes.root}>
        <Grid container className={classes.pollingContainer} spacing={16}>
          <Grid item >
            <div className={classes.pollingTitle}>
              {polling.pollingTitle}
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.metaDataContainer} spacing={16}>
          <Grid item >
            <div className={classes.numOfMaxPollng}>
              {constant.numOfMaxPollngLabel}: {numOfMaxPollng}
            </div>
          </Grid>
          <Grid item >
            <div className={classes.pollingRange}>
              {constant.pollingRangeLabel}: {polling.pollingRange} km
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.pollingContainer} spacing={16}>
          <Grid item xs={12}>
            <Paper>
              {
                polling.pollingOptionValues.map( (option, index) => {
                  if(selectedOption.indexOf(index) >= 0) {
                    return (
                      <button key={index} onClick={(evt) => this.poll(evt, index)} className={`${classes.pollingOption} ${classes.selected}`}>
                          {option}
                      </button>
                    )
                  }else {
                    return (
                      <button key={index} onClick={(evt) => this.poll(evt, index)} className={classes.pollingOption}>
                        {option}
                      </button>
                    )
                  }
                })
              }

              <Button size="large" variant="contained" className={classes.button} color="primary" onClick={() => this.onSubmit()}>
                {constant.polling}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

PollingView.propTypes = {
  classes: PropTypes.object.isRequired,
  polling: PropTypes.object.isRequired,
  handlePollingDialogCloseCallback: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar:
      (message, variant) =>
        dispatch(openSnackbar(message, variant)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PollingView));
