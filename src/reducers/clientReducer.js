import * as actionTypes from '../actions/client/actionTypes';
import _ from 'lodash';

const initialState = {
  clientUser: null,
  oppositeUser: null,
  isLoading: true,
  messageChat: [],
  loggedUserChat: [],
  oppositeUserChat: [],
  oppositeUserName: null,
  uploadFiles: [],
  unseenMessages: [],
};

const {
  clientUser,
  isLoading,
  messageChat,
  loggedUserChat,
  oppositeUserChat,
} = initialState;

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CLIENT_USER:
      return {
        clientUser: action.payload.clientUser,
        isLoading: true,
      };

    case actionTypes.CLEAR_CLIENT_USER:
      return {
        ...initialState,
        isLoading: true,
      };
    case actionTypes.SET_CHATBOX_MESSAGE:
      return {
        ...state,
        messageChat: action.payload.chatMsg,
        isLoading: false,
      };
    case actionTypes.LOGGED_USER_MESSAGE:
      return {
        ...state,
        loggedUserChat: action.payload.userChat,
      };
    case actionTypes.OPPOSITE_USER_MESSAGE:
      return {
        ...state,
        oppositeUserChat: action.payload.oppositeChat,
      };
    case actionTypes.SET_OPPOSITE_USER:
      return {
        ...state,
        oppositeUser: action.payload.oppositeUser,
        isLoading: true,
      };

    case actionTypes.CLEAR_OPPOSITE_USER:
      return {
        ...initialState,
        isLoading: true,
      };

    case actionTypes.SET_OPPOSITE_USER_NAME:
      return {
        ...state,
        oppositeUserName: action.payload.oppositeUserName,
      };

    case actionTypes.SET_UPLOAD_FILES:
      return {
        ...state,
        uploadFiles: action.payload.uploadFile,
      };

    default:
      return state;
  }

  return state;
};

export default clientReducer;
