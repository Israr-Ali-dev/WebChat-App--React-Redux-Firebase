import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import firebase from '../../../firebase';
import { useDispatch, useSelector, connect } from 'react-redux';
import AppenText from './AppendText';
import TypingIndicator from './TypingIndicator';
import UsersList from './UsersList';
import _, { set } from 'lodash';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { LeftMsgSkeleton, RightMsgSkeleton } from './SkeletonBody';
import TopNav from './TopNav';
import SideNav from './SideNav';
import ProductDetail from './ProductDetail';
import Logout from '../../auth/Logout';
import CustomDropZone from './CustomDropzone';
import { v4 as uuidv4 } from 'uuid';

import {
  setUnseenMessages,
  setUploadFiles,
} from '../../../actions/customerSupport/actionCreators';

function Dashboard(props) {
  const [scripts, setscripts] = useState(true);
  const [message, setMessage] = useState('');
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
  const [toggleClass, setToggleClass] = useState({
    userToggle: false,
    productToggle: false,
  });

  const textInput = useRef(null);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [typingAnimtion, setTypingAnimtion] = useState(false);
  const [removeAnimtion, setRemoveAnimtion] = useState(false);
  let history = useHistory();
  let dispatch = useDispatch();

  const { userToggle, productToggle } = toggleClass;
  const {
    messages,
    messagesRef,
    typingRef,
    emojiPicker,
    uploadMedia,
    storageRef,
    imageURL,
  } = sendMessage;
  const messageChat = useSelector(
    (state) => state.customerSupportReducer.messageChat
  );
  const loggedUser = useSelector(
    (state) => state.customerSupportReducer.currentUser
  );
  const oppositeUser = useSelector(
    (state) => state.customerSupportReducer.oppositeUser
  );
  const oppositeUserName = useSelector(
    (state) => state.customerSupportReducer.oppositeUserName
  );
  const isLoadingChat = useSelector(
    (state) => state.customerSupportReducer.isLoading
  );
  const uploadFiles = useSelector(
    (state) => state.customerSupportReducer.uploadFiles
  );

  const createMessage = async () => {
    if (Array.isArray(uploadFiles) && uploadFiles.length) {
      var imgaeURL = await handleUpload();

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
        seen: 'No',
        receiver: {
          id: oppositeUser,
        },
      };
      return messages;
    }
  };

  const handleMessage = (e) => {
    if (e.target.value.length === 0) {
      typingRef.child(loggedUser.uid).child(oppositeUser).remove();
    }

    setMessage(e.target.value);
  };

  const handleUploadFile = () => {
    setSendMessage({ ...sendMessage, uploadMedia: !uploadMedia });
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

  const handleTogglePicker = () => {
    setSendMessage({ ...sendMessage, emojiPicker: !emojiPicker });
  };

  const handleAddEmoji = (emoji) => {
    const oldMessage = message;
    const newMessage = colonToUnicode(`${oldMessage}${emoji.colons}`);

    setMessage(newMessage);
    setSendMessage({ ...sendMessage, emojiPicker: false });
    setTimeout(() => textInput.current.focus(), 0);
  };

  const colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, '');
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }
      x = ':' + x + ':';
      return x;
    });
  };

  const sendText = (e) => {
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

        typingRef.child(loggedUser.uid).child(oppositeUser).remove();
        setTypingAnimtion(false);
      });
    }
  };

  const handleTyping = (e) => {
    //  ShortCut Combo Key to send Text
    if (e.ctrlKey && e.keyCode === 13) {
      sendText();
    }
    typingRef
      .child(loggedUser.uid)
      .child(oppositeUser)
      .set(loggedUser.displayName);
  };

  useEffect(() => {
    if (loggedUser && oppositeUser) {
      typingRef.child(oppositeUser).on('child_added', (snap) => {
        if (snap.key === loggedUser.uid) {
          setTypingAnimtion(true);
        }
      });
      setRemoveAnimtion(true);
    }

    if (loggedUser && oppositeUser) {
      messagesRef.on('child_added', (snap) => {
        if (
          snap.val().receiver.id === loggedUser.uid &&
          oppositeUser !== snap.val().sender.id &&
          snap.val().seen === 'No'
        ) {
          dispatch(setUnseenMessages(snap.val()));
        }
      });
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

  // useEffect(() => {
  //   //An array of assets
  //   // let scripts = [
  //   //   { src: '/assets/vendor/jquery/jquery.js' },
  //   //   { src: '/assets/js/main.js' },
  //   //   { src: '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js' },
  //   //   { src: '/assets/vendor/jquery-easing/jquery.easing.min.js' },
  //   //   { src: '/assets/js/sb-admin-2.min.js' },
  //   // ];
  //   // //Append the script element on each iteration
  //   // scripts.map((item) => {
  //   //   const script = document.createElement('script');
  //   //   script.src = item.src;
  //   //   script.defer = true;
  //   //   document.body.appendChild(script);
  //   //   return () => {
  //   //     document.body.removeChild(script);
  //   //   };
  //   // });
  // }, [scripts]);

  const chatBox = () => {
    return (
      <Fragment>
        <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 chatbox-container'>
          <div className='selected-user'>
            <span>
              To:
              <span className='name'>
                {oppositeUserName ? oppositeUserName : null}
              </span>
            </span>
          </div>
          <div className='chat-container'>
            <ul className='chat-box chatContainerScroll'>
              {isLoadingChat
                ? [...Array(7)].map((_, i) => {
                    if (i % 2 === 0) {
                      return <Fragment key={i}>{LeftMsgSkeleton()}</Fragment>;
                    } else {
                      return (
                        <Fragment key={i}> {RightMsgSkeleton()} </Fragment>
                      );
                    }
                  })
                : null}
              {messageChat
                ? messageChat.map((msg, i) => {
                    if (msg.sender.id !== loggedUser.uid) {
                      return (
                        <li className='chat-left' key={i}>
                          <div className='chat-avatar'>
                            <img src={msg.sender.avatar} alt='Retail Admin' />
                            <div className='chat-hour'>08:57</div>
                          </div>
                          <div className='chat-text'>
                            {msg.image ? (
                              <div className='chat-img-group'>
                                <img
                                  src={msg.image}
                                  className='img-fluid chat-img'
                                  alt='img-u'
                                />
                              </div>
                            ) : null}
                            {msg.content}
                          </div>
                        </li>
                      );
                    } else {
                      return (
                        <li key={i} className='chat-right'>
                          <div
                            className='chat-text'
                            style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.image ? (
                              <div className='chat-img-group'>
                                <img
                                  src={msg.image}
                                  className='img-fluid chat-img'
                                  alt='img-u'
                                />
                              </div>
                            ) : null}

                            {msg.content}
                          </div>
                          <div className='chat-avatar'>
                            <img src={msg.sender.avatar} alt='Retail Admin' />
                            <div className='chat-name'></div>
                          </div>
                        </li>
                      );
                    }
                  })
                : null}

              {typingAnimtion ? <TypingIndicator /> : null}
              {emojiPicker ? (
                <Picker
                  set='apple'
                  onSelect={handleAddEmoji}
                  className='emojiPicker'
                  title='pick your emoji'
                  emoji='point_up'
                  style={{ position: 'fixed', bottom: '11%' }}
                />
              ) : null}

              {uploadMedia ? (
                <CustomDropZone className='dropzone-style' />
              ) : null}
              <div ref={messagesEndRef} style={{ margin: '10px' }} />
            </ul>

            {messageChat ? (
              <div className='send-message-box'>
                <textarea
                  id='autoHeight'
                  value={message ? message : ''}
                  rows='1'
                  ref={textInput}
                  label={
                    <button
                      icon={emojiPicker ? 'close' : 'add'}
                      content={emojiPicker ? 'close' : null}
                      onClick={handleTogglePicker}></button>
                  }
                  placeholder='Type here...'
                  onChange={handleMessage}
                  onKeyDown={(e) => {
                    handleTyping(e);
                  }}></textarea>

                <span className='btn' onClick={handleTogglePicker}>
                  <span className='emoji'></span>
                </span>

                <span className='btn' onClick={handleUploadFile}>
                  <span className='attach'></span>
                </span>
                <span className='' id='send-txt' onClick={sendText}>
                  <i className='fas fa-paper-plane'></i>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      {/* Page Wrapper */}
      <div id='wrapper'>
        {/* Sidebar */}
        {<SideNav />}
        {/* Sidebar End */}
        {/* Content Wrapper */}
        <div id='content-wrapper' className='d-flex flex-column'>
          {/* Main Content */}
          <div id='content'>
            {/* Topbar */}
            {<TopNav />}
            {/* End of Topbar */}

            {/* Begin Page Content */}
            <div className='container-fluid p-0' id='chat-content'>
              {/* Content Row */}
              <div className='row'>
                {<UsersList />}
                {chatBox()}

                {<ProductDetail />}
              </div>
            </div>
            {/* /.container-fluid */}
          </div>
          {/* End of Main Content */}
          {<Logout />}
          {/* Footer */}
          <footer className='sticky-footer bg-white'>
            <div className='container my-auto'>
              <div className='copyright text-center my-auto'>
                <span>Copyright &copy; React Chat App 2021</span>
              </div>
            </div>
          </footer>
          {/* End of Footer */}
        </div>
        {/* End of Content Wrapper  */}
      </div>
      {/* End of Page Wrapper */}
    </Fragment>
  );
}

export default connect()(Dashboard);
