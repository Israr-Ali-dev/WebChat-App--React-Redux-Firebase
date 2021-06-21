import * as actionTypes from './actionTypes';

export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = (user) => {
  return {
    type: actionTypes.CLEAR_USER,
  };
};

export const getUserMessage = (msgs) => {
  return {
    type: actionTypes.GET_USER_MESSAGE,
    payload: {
      msgChat: msgs,
    },
  };
};

export const setUserMessage = (msgs) => {
  return {
    type: actionTypes.LOGGED_USER_MESSAGE,
    payload: {
      userChat: msgs,
    },
  };
};

export const setOppositeUserMessage = (msgs) => {
  return {
    type: actionTypes.OPPOSITE_USER_MESSAGE,
    payload: {
      oppositeChat: msgs,
    },
  };
};

export const setChatBoxMessage = (chatMsgs) => {
  return {
    type: actionTypes.SET_CHATBOX_MESSAGE,
    payload: {
      chatMsg: chatMsgs,
    },
  };
};

export const setOppositeUser = (user) => {
  return {
    type: actionTypes.SET_OPPOSITE_USER,
    payload: {
      oppositeUser: user,
    },
  };
};

export const clearOppositeUser = (user) => {
  return {
    type: actionTypes.CLEAR_OPPOSITE_USER,
  };
};

export const setOppositeUserName = (name) => {
  return {
    type: actionTypes.SET_OPPOSITE_USER_NAME,
    payload: {
      oppositeUserName: name,
    },
  };
};

export const setUploadFiles = (files) => {
  return {
    type: actionTypes.SET_UPLOAD_FILES,
    payload: {
      uploadFile: files,
    },
  };
};

export const setUnseenMessages = (msgs) => {
  return {
    type: actionTypes.SET_UNSEEEN_MESSAGES,
    payload: {
      unseenMessages: msgs,
    },
  };
};
