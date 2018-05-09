import { combineReducers } from 'redux'; 
import { constant } from './config/default';
import {
  FETCH_USER,
  FETCH_USER_PROFILE,
  FETCH_LOCATION,
  DISABLE_LOCATION,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER,
  UPDATE_FILTER_DEFAULT,
  UPDATE_FILTER_TAG_LIST,
  RESET_FILTER_TAGS,
  UPDATE_FILTER_TAG,  
  UPDATE_RECENT_MESSAGE,
  FETCH_ADDRESS_BOOK,
  FETCH_PUBLIC_ADDRESS_BOOK,
  FETCH_FOCUS_MESSAGE,
  TOGGLE_ADDRESS_DIALOG,
  TOGGLE_NEARBYEVENT_DIALOG,
  TOGGLE_REGIONEVENT_DIALOG,
  UPDATE_PUBLIC_PROFILE_DIALOG,
  TOGGLE_PUBLIC_PROFILE_DIALOG,  
  TOGGLE_LEADER_BOARD,
  FETCH_TOP_TWENTY,
  UPDATE_FILTER_SORTING
} from './actions/types';


function geoLocationReducer(state={pos: null, enabled: true}, action) {
  switch (action.type) {
    case FETCH_LOCATION:
      return {...state, pos: action.geoLocation.coords, enabled: true };
    case DISABLE_LOCATION: 
      return {...state, pos: null, enabled: false};
    default:
      return state;
  }
}

function userReducer(state={user: null, userProfile: null, loading: true}, action) {
  switch (action.type) {
    case FETCH_USER:
      return {...state, user: action.user, loading: action.loading};
    case FETCH_USER_PROFILE:
      return {...state, userProfile: action.userProfile};
    default:
      return state;
  }
}

function addressBookReducer(state={addresses:[], publicAddress:[]}, action) {
  switch (action.type) {
    case FETCH_ADDRESS_BOOK:
      return {...state,
            addresses: action.addresses}
    case FETCH_PUBLIC_ADDRESS_BOOK:
      return {...state,
              publicAddresses: action.addresses}
    default:
      return state;
  }
}

function filterReducer(state={defaultEventNumber: constant.defaultEventNumber, eventNumber: constant.defaultEventNumber, geolocation: null, distance: 1, defaultDistance: 1, selectedTag: null, tagList: []}, action) {
  switch (action.type) {
    case UPDATE_FILTER_DEFAULT:
      return {
        selectedTag: null, 
        selectedSorting: null,
        tagList: [],
        defaultEventNumber: action.eventNumber,
        eventNumber: action.eventNumber,
        geolocation: action.geolocation,
        distance: action.distance,
        defaultDistance: action.distance,
      };    
    case UPDATE_FILTER:
      var distance = action.distance;
      if(state.defaultDistance > distance) {
        distance = state.defaultDistance;
      }
      var eventNumber = action.eventNumber;
      if(state.defaultEventNumber > eventNumber) {
        eventNumber = state.defaultEventNumber;
      }
      return {
        ...state,
        selectedTag: null, 
        tagList: [],
        eventNumber: eventNumber,
        geolocation: action.geolocation,
        distance: distance
      };
    case UPDATE_FILTER_LOCATION:
      var distance = action.distance;
      if(state.defaultDistance > distance || distance == undefined) {
        distance = state.defaultDistance;
      }    
      return {
        ...state,
        selectedTag: null, 
        tagList: [],
        geolocation: action.geolocation,
        distance: distance
      }
    case UPDATE_FILTER_TAG_LIST:
      var tagList = state.tagList;
      var newTagList = action.tagList;
      if(newTagList != null) {
        newTagList.map((tag) => {
          if(!tagList.includes(tag)) {
            tagList.push(tag);
          }
        });
      }
      //console.log("update Tag List" + tagList.join());
      return {
        ...state,
        selectedTag: null, 
        tagList: tagList,
      };   
    case RESET_FILTER_TAGS:
      return {
        ...state,
        selectedTag: null, 
        tagList: []
      };   
    case UPDATE_FILTER_TAG:    
      return {
        ...state,
        selectedTag: action.selectedTag
      };  
    case UPDATE_FILTER_SORTING:
      return {
        ...state,
        selectedSorting: action.selectedSorting
      };
    default:
      return state;
  }
}

function addressDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_ADDRESS_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function nearbyEventDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_NEARBYEVENT_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function regionEventDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_REGIONEVENT_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function leaderBoardReducer(state={open: false, topTwenty:[]}, action) {
  //console.log(action);
  switch (action.type) {
    case TOGGLE_LEADER_BOARD:
      return {...state, open: action.open};
    case FETCH_TOP_TWENTY:
      return {...state, topTwenty: action.users};
    default:
      return state;
  }
}

function recentMessageReducer(state={open: false, id: "", recentids: []}, action) {
  switch (action.type) {
    case UPDATE_RECENT_MESSAGE:
      let recentids = state.recentids;
      var index = recentids.indexOf(action.id);
      if(index == -1)
      {
          recentids.push(action.id);
      }
      return {open: action.open, id: action.id, recentids: recentids};
    default:
      return state;
  }
}

function publicProfileDialogReducer(state={open: false, id: "", fbId: ""}, action) {
//  console.log(action);
  switch (action.type) {
    case UPDATE_PUBLIC_PROFILE_DIALOG:
      return {open: action.open, id: action.id, fbId: action.fbId};
    case TOGGLE_PUBLIC_PROFILE_DIALOG:
      if(action.open == false) {
        return {...state, id: "", open: action.open};
      } else {
        return {...state, open: action.open};
      }
    default:
      return state;
  }
}

function ourlandReducer(state={focusMessages: []}, action) {
    switch (action.type) {
      case FETCH_FOCUS_MESSAGE:
        return {...state, focusMessages: action.messages};
      default:
        return state;
    }
  }

  const tagSuggestions = [
    { label: '公共地方維修' },
    { label: '兒童遊樂場' },
    { label: '郵箱' },
    { label: '活動' },
    { label: '公共設施' },
    { label: '假日診所' },
    { label: '寵物' },
    { label: '社區規劃' },
    { label: '社區匯報' },
    { label: '社區幹事' },

    
  ].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
  }));

function suggestionReducer(state={tag: tagSuggestions}, action) {
  switch (action.type) {
/*
    case FETCH_FOCUS_MESSAGE:
      return {...state, focusMessages: action.messages};
*/      
    default:
      return state;
  }
}

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer,
  user: userReducer,
  filter: filterReducer,
  addressBook: addressBookReducer,
  ourland: ourlandReducer,
  addressDialog: addressDialogReducer,
  nearbyEventDialog: nearbyEventDialogReducer,
  regionEventDialog: regionEventDialogReducer,
  leaderBoard: leaderBoardReducer,
  recentMessage: recentMessageReducer,
  publicProfileDialog: publicProfileDialogReducer,
  suggestions: suggestionReducer,
});


export default rootReducer;
