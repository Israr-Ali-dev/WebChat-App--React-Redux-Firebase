import React, { Fragment, useState, useEffect, useRef } from 'react';
import './Popup.css';
import firebase from 'firebase';
import { Link, Redirect, useHistory } from 'react-router-dom';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import TypingIndicator from './TypingIndicator';
import CustomDropzone from './CustomDropzone';
import {
  setClientUser,
  setUserMessage,
  setChatBoxMessage,
  setOppositeUser,
  setOppositeUserName,
  setOppositeUserMessage,
  setUploadFiles,
} from '../../../actions/client/actionCreators';
import _ from 'lodash';

function Popup() {
  const [showChat, setShowChat] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userLogin, setUserLogin] = useState(false);
  const [message, setMessage] = useState('');
  const client = useSelector((state) => state.clientReducer.clientUser);
  let dispatch = useDispatch();
  let history = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
    usersRef: firebase.database().ref('users'),
  });

  const [typingAnimtion, setTypingAnimtion] = useState(false);
  const [removeAnimtion, setRemoveAnimtion] = useState(false);

  const [sendMessage, setSendMessage] = useState({
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    storageRef: firebase.storage().ref(),
    messages: [],
    messagesShow: false,
    getUserMessages: [],
    combineChat: [],
    emojiPicker: false,
    uploadMedia: false,
    imageURL: '',
  });
  const messageChat = useSelector((state) => state.clientReducer.messageChat);
  const loggedUser = useSelector((state) => state.clientReducer.clientUser);
  const oppositeUser = useSelector((state) => state.clientReducer.oppositeUser);
  const isLoadingChat = useSelector((state) => state.clientReducer.isLoading);
  const uploadFiles = useSelector((state) => state.clientReducer.uploadFiles);
  const opppsiteUserChat = useSelector(
    (state) => state.clientReducer.oppositeUserChat
  );
  const loggedUserChat = useSelector(
    (state) => state.clientReducer.loggedUserChat
  );

  const {
    messages,
    messagesRef,
    typingRef,
    uploadMedia,
    storageRef,
    imageURL,
  } = sendMessage;

  const { name, email, password, error, success, loading, usersRef } = values;

  const textInput = useRef(null);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const createMessage = async () => {
    if (Array.isArray(uploadFiles) && uploadFiles.length) {
      var imgaeURL = await handleUpload();

      if (oppositeUser) {
        const messages = {
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sender: {
            id: loggedUser.uid,
            name: loggedUser.displayName,
            avatar: loggedUser.photoURL,
          },
          content: message,
          image: imgaeURL,
          seen: 'No',
          receiver: {
            id: oppositeUser,
          },
        };
        return messages;
      } else {
        const messages = {
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sender: {
            id: loggedUser.uid,
            name: loggedUser.displayName,
            avatar: loggedUser.photoURL,
          },
          content: message,
          image: imgaeURL,
          seen: 'No',
          receiver: {
            id: 'none',
          },
        };
        return messages;
      }
    } else {
      if (oppositeUser) {
        const messages = {
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sender: {
            id: loggedUser.uid,
            name: loggedUser.displayName,
            avatar: loggedUser.photoURL,
          },
          content: message,
          seen: 'No',
          receiver: {
            id: oppositeUser,
          },
        };
        return messages;
      } else {
        const messages = {
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sender: {
            id: loggedUser.uid,
            name: loggedUser.displayName,
            avatar: loggedUser.photoURL,
          },
          content: message,
          seen: 'No',
          receiver: {
            id: 'none',
          },
        };
        return messages;
      }
    }
  };
  const sendText = (e) => {
    setSendMessage({
      ...sendMessage,
      messages: [...messages, message],
      messagesShow: true,
    });

    if (message) {
      createMessage().then((messages) => {
        messagesRef
          .push()
          .set(messages)
          .then(() => {
            console.log('message save');

            // Scroll Down to Latest Message
            if (messagesEndRef) {
              messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
              });
            }

            // Close Custom DropZone Box and remove Image URL
            if (uploadMedia) {
              setSendMessage({
                ...sendMessage,
                uploadMedia: !uploadMedia,
                imageURL: '',
              });
            }
            // Empty Message Input
            setMessage('');
            // Empty upload files
            dispatch(setUploadFiles([]));
          })
          .catch((err) => {
            console.error(err);
          });

        if (oppositeUser) {
          typingRef.child(loggedUser.uid).child(oppositeUser).remove();
          setTypingAnimtion(false);
        }
      });
    }
  };
  const handleUploadFile = () => {
    setSendMessage({ ...sendMessage, uploadMedia: !uploadMedia });
  };
  const handleMessage = (e) => {
    if (e.target.value.length === 0) {
      typingRef.child(loggedUser.uid).child(oppositeUser).remove();
    }

    setMessage(e.target.value);
  };

  const handleTyping = (e) => {
    //  ShortCut Combo Key to send Text
    if (e.ctrlKey && e.keyCode === 13) {
      sendText();
    }

    if (oppositeUser) {
      typingRef
        .child(loggedUser.uid)
        .child(oppositeUser)
        .set(loggedUser.displayName);
    }
  };

  // Upload Image to Firbase Derver & download Link
  const handleUpload = () => {
    return new Promise(function (myResolve, myReject) {
      if (uploadFiles) {
        uploadFiles.forEach((file) => {
          const reader = new FileReader();

          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = () => {
            // Do whatever you want with the file contents

            if (reader.result) {
              const uploadTask = storageRef
                .child(`/chat/public/${uuidv4()}.jpg`)
                .putString(reader.result, 'data_url', {
                  contentType: 'image/jpg',
                });
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  // console.log(snapshot);
                },
                (err) => {
                  console.error(err);
                },
                () => {
                  uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then((downloadUrl) => {
                      myResolve(downloadUrl);
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }
              );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const isFormValid = () => {
    if (isFormEmpty(name, email, password)) {
      setValues({ ...values, error: 'Please fill all fields' });
      return false;
    } else if (!isPasswordValid()) {
      setValues({ ...values, error: 'Password is invalid' });
      return false;
    } else {
      return true;
    }
  };

  const isLoginFormValid = () => {
    if (isLoginFormEmpty(email, password)) {
      setValues({ ...values, error: 'Please fill all fields' });
      return false;
    } else if (!isPasswordValid()) {
      setValues({ ...values, error: 'Password is invalid' });
      return false;
    } else {
      return true;
    }
  };
  const isPasswordValid = () => {
    if (password.length !== 6) {
      return false;
    } else {
      return true;
    }
  };

  const isLoginFormEmpty = () => {
    return !email.length || !password.length;
  };

  const isFormEmpty = () => {
    return !name.length || !email.length || !password.length;
  };

  const registerSubmit = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: name,
              photoURL: `https://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
              role: 0,
            })
            .then(() => {
              // console.log(createdUser);
              setValues({ ...values, loading: true });
              saveUser(createdUser)
                .then(() => {
                  setUserLogin(true);

                  console.log('user saved');
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });

          setValues({
            ...values,
            success: true,
          });
        })
        .catch((err) => {
          setValues({
            ...values,
            error: err.message,
            success: false,
          });
        });
    }
  };

  const loginSubmit = (event) => {
    event.preventDefault();
    if (isLoginFormValid()) {
      setValues({
        ...values,
        laoding: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {})
        .catch((err) => {
          console.log(err.message);
          setValues({
            ...values,
            error: err.message,
            success: false,
            loading: false,
          });
        });
    }
  };

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      id: createdUser.user.uid,
      email: email,
      role: 0,
    });
  };

  const showError = () => {
    return (
      <div
        className='error'
        style={{
          display: error ? '' : 'none',
          color: 'red',
          fontSize: '12px',
          marginBottom: '10px',
        }}>
        {error}
      </div>
    );
  };

  const showSuccess = () => {
    return (
      <div
        className='success'
        style={{
          display: success ? '' : 'none',
          color: 'green',
          fontSize: '12px',
          marginBottom: '10px',
        }}>
        Account Created Successfully!
        <Redirect to='/'></Redirect>
      </div>
    );
  };

  const handleShowChat = () => {
    setShowChat(!showChat);
  };

  const handleRegister = () => {
    setShowRegister(!showRegister);
  };

  useEffect(() => {
    if (loggedUser) {
      let oppositeID;
      // Set Opposite User ID After Customer Support Reply
      messagesRef
        .orderByChild('sender/id')
        .equalTo(loggedUser.uid)
        .on('value', function (data) {
          var senderMsgs = _.values(data.val());
          senderMsgs.map((m) => {
            if (m.receiver.id !== 'none') {
              oppositeID = m.receiver.id;
            }
          });
          if (oppositeID) {
            dispatch(setOppositeUser(oppositeID));
            // Set Opposite User Name After Customer Support Reply
            if (oppositeID) {
              console.log(oppositeID);
              usersRef
                .orderByChild('id')
                .equalTo(oppositeID)
                .on('value', function (data) {
                  let oppositeData = _.values(data.val());
                  dispatch(setOppositeUserName(oppositeData[0].name));
                });
            }
          }
        });
    }
  }, [loggedUser]);

  useEffect(() => {
    if (oppositeUser && loggedUser) {
      let senderMsg = [];

      //Check First Msg From Client
      // Get Users Message
      messagesRef
        .orderByChild('sender/id')
        .equalTo(loggedUser.uid)
        .on('value', function (snapshot) {
          let msgs = _.values(snapshot.val());
          senderMsg = _.compact(
            _.map(msgs, (m) => {
              if (m.receiver.id === oppositeUser) {
                return m;
              }
            })
          );

          if (senderMsg) {
            // setUserMsgs(senderMsg);
            dispatch(setUserMessage(senderMsg));
          }
        });

      // Get Opposite Users Message
      messagesRef
        .orderByChild('sender/id')
        .equalTo(`${oppositeUser}`)
        .on('value', function (snap) {
          let val = _.values(snap.val());

          const oppositeMsg = _.compact(
            val.map((v) => {
              // Already Continue Chat
              if (v.receiver.id === loggedUser.uid) {
                return v;
              }
              // For New USer with No resposnse
              else if (v.receiver.id === 'none') {
                let g = {};
                g = snap.val();
                v.receiver.id = loggedUser.uid;
                let o = Object.keys(g);
                firebase
                  .database()
                  .ref(`messages/${o[0]}/receiver`)
                  .child('id')
                  .set(`${loggedUser.uid}`);

                return v;
              }
            })
          );

          if (oppositeMsg) {
            dispatch(setOppositeUserMessage(oppositeMsg));
            const merge = _.concat(senderMsg, oppositeMsg);
            const timeUpdate = merge.map((m) => {
              m.timestamp = new Date(m.timestamp);
              return m;
            });

            if (timeUpdate) {
              dispatch(setChatBoxMessage(_.sortBy(timeUpdate, 'timestamp')));
            }
          }
        });
    }
  }, [oppositeUser, loggedUser]);

  useEffect(() => {
    if (loggedUserChat && opppsiteUserChat) {
      const merge = _.concat(loggedUserChat, opppsiteUserChat);
      const timeUpdate = merge.map((m) => {
        m.timestamp = new Date(m.timestamp);
        return m;
      });
      if (timeUpdate) {
        dispatch(setChatBoxMessage(_.sortBy(timeUpdate, 'timestamp')));
      }
    }
  }, [loggedUserChat, opppsiteUserChat]);

  // Typing Animation UseEffect
  useEffect(() => {
    if (loggedUser && oppositeUser) {
      console.log('logged ' + loggedUser);
      console.log('oppsite ' + oppositeUser);
      typingRef.child(oppositeUser).on('child_added', (snap) => {
        if (snap.key === loggedUser.uid) {
          setTypingAnimtion(true);
        }
      });
      setRemoveAnimtion(true);
    }
  }, [
    typingAnimtion,
    removeAnimtion,
    loggedUser,
    oppositeUser,
    typingRef,
    messagesRef,
  ]);

  useEffect(() => {
    typingRef.on('child_removed', (snap) => {
      if (snap.key === oppositeUser) {
        setTypingAnimtion(false);
      }
    });
  }, [typingAnimtion]);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => history.push('/client'));
  };

  const clientLogin = () => {
    return (
      <Fragment>
        <div className='custom-login-body'>
          <div className='row'>
            {/* <div className='col-lg-6 d-none d-lg-block bg-login-image'></div> */}
            <div className='col-lg-12'>
              <div className='px-3 pt-5'>
                {error ? showError() : null}
                {success ? showSuccess() : null}
                <div className='user'>
                  <div className='form-group'>
                    <input
                      type='email'
                      className='form-control form-control-user'
                      placeholder='Email'
                      onChange={handleChange('email')}
                      value={email}
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      type='password'
                      className='form-control form-control-user'
                      placeholder='Password'
                      onChange={handleChange('password')}
                      value={password}
                    />
                  </div>

                  <span
                    className='btn btn-primary btn-user btn-block text-light'
                    onClick={loginSubmit}
                    onSubmit={loginSubmit}>
                    Quick Login
                  </span>
                </div>
                <br />
                <div className='text-center'>
                  <span
                    onClick={handleRegister}
                    className='small'
                    style={{ cursor: 'pointer' }}>
                    Create an Account!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const clientRegister = () => {
    return (
      <Fragment>
        <div className='custom-login-body'>
          <div className='row'>
            {/* <div className='col-lg-6 d-none d-lg-block bg-login-image'></div> */}
            <div className='col-lg-12'>
              <div className='px-3 pt-5'>
                {error ? showError() : null}
                {success ? showSuccess() : null}
                <div className='user'>
                  <div className='form-group'>
                    <input
                      type='email'
                      className='form-control form-control-user'
                      placeholder='Name'
                      onChange={handleChange('name')}
                      value={name}
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      type='email'
                      className='form-control form-control-user'
                      placeholder='Email'
                      onChange={handleChange('email')}
                      value={email}
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      type='password'
                      className='form-control form-control-user'
                      placeholder='Password'
                      onChange={handleChange('password')}
                      value={password}
                    />
                  </div>

                  <span
                    className='btn btn-primary btn-user btn-block text-light'
                    onClick={registerSubmit}
                    onSubmit={registerSubmit}>
                    Instant Register
                  </span>
                </div>
                <div className='text-center'>
                  <span
                    onClick={handleRegister}
                    className='small'
                    style={{ cursor: 'pointer', marginTop: '5px' }}>
                    Already have Account!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const chatBox = () => {
    return (
      <Fragment>
        <div className='custom-chat-body'>
          <ul className='chat-container'>
            {messageChat
              ? messageChat.map((msg, i) => {
                  if (msg.sender.id !== loggedUser.uid) {
                    return (
                      <li className='popup-chat-left'>
                        {msg.image ? (
                          <div className='chat-img-group'>
                            <img
                              src={msg.image}
                              className='img-fluid chat-img'
                              alt='p-img'
                            />
                          </div>
                        ) : null}
                        {msg.content}
                      </li>
                    );
                  } else {
                    return (
                      <li className='popup-chat-right'>
                        {msg.image ? (
                          <div className='chat-img-group'>
                            <img
                              src={msg.image}
                              className='img-fluid chat-img'
                              alt='p-img'
                            />
                          </div>
                        ) : null}
                        {msg.content}
                      </li>
                    );
                  }
                })
              : null}
            {typingAnimtion ? <TypingIndicator /> : null}

            {uploadMedia ? <CustomDropzone uploadImage={handleUpload} /> : null}
            <div ref={messagesEndRef} style={{ margin: '0px' }} />
          </ul>
        </div>

        <div className='blanter-msg'>
          <textarea
            id='chat-input'
            placeholder='Write a response'
            row='1'
            ref={textInput}
            value={message ? message : ''}
            onChange={handleMessage}
            onKeyDown={(e) => {
              handleTyping(e);
            }}></textarea>
          <span
            id='attach-file'
            onClick={handleUploadFile}
            style={{ cursor: 'pointer' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1040.099'
              height='498.138'
              viewBox='-150 -100 640.099 598.138'>
              <path
                id='Shape'
                d='M334.445,398.138c-29.525.005-60.129-14.417-88.822-43.085L24.134,133a87.8,87.8,0,0,1-23-44.4C-1.807,72.059-.446,47.474,22.773,24.255,46.566.437,70.264-1.66,85.961.785c22.634,3.514,38.926,17.749,44.875,23.7L353.308,247.489c6.095,6.084,20.411,20.376,20.411,39.743,0,11.8-5.212,22.987-15.5,33.245-9.175,9.195-34.384,26.828-69.656-8.378L66.463,90.176a12.6,12.6,0,0,1,17.81-17.83l222.1,221.918c21.258,21.2,30.543,11.887,34.032,8.388,5.389-5.374,8.111-10.561,8.111-15.425,0-8.912-8.8-17.7-13.031-21.918L113.011,42.3c-4.194-4.194-15.622-14.226-30.916-16.6C67.683,23.454,53.7,28.964,40.6,42.075,28.126,54.552,23.2,68.717,25.954,84.187a62.083,62.083,0,0,0,16.015,31l221.49,222.059c25.4,25.376,75.589,60.426,126.13,9.9,23.168-23.168,30.387-47.39,22.074-74.047-5.192-16.67-16.681-34.213-33.215-50.732L185.177,29.987a12.6,12.6,0,0,1,17.779-17.86L396.237,204.51c19.428,19.418,33.074,40.529,39.476,61.076,7.7,24.706,9.049,62.009-28.315,99.377C385.238,387.124,360.25,398.138,334.445,398.138Z'
                fill='#9d9d9d'
              />
            </svg>
          </span>

          <span id='send-it' onClick={sendText}>
            <svg viewBox='0 0 448 448'>
              <path d='M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z' />
            </svg>
          </span>
        </div>
      </Fragment>
    );
  };

  const popupChat = () => {
    return (
      <Fragment>
        <div
          id='custom-chat'
          className='hide'
          style={showChat ? { display: 'block' } : null}>
          <div className='header-chat'>
            <div className='head-home'>
              <div className='info-avatar'>
                <img
                  src='assets/img/icons/customer support.png'
                  width='50px'
                  alt='icon'
                  onClick={handleLogout}
                />
              </div>
              <p>
                <span className='custom-name'>Chat App</span>
                <br />
                <small>Typically replies within an hour</small>
              </p>
            </div>
          </div>
          <div className='start-chat'>
            {client
              ? chatBox()
              : showRegister
              ? clientRegister()
              : clientLogin()}
          </div>
          <span className='close-chat' onClick={handleShowChat}>
            ×
          </span>
        </div>
        <span
          className='blantershow-chat'
          title='Show Chat'
          onClick={handleShowChat}>
          <img
            src='assets/img/icons/customer support.png'
            width='50px'
            alt='icon'
          />
        </span>
      </Fragment>
    );
  };

  return <Fragment>{popupChat()}</Fragment>;
}

export default Popup;
