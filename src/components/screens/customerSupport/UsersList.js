import React, { useEffect, useState, Fragment, Children } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../../firebase';
import _ from 'lodash';
import {
  getUserMessage,
  setUserMessage,
  setOppositeUserMessage,
  setChatBoxMessage,
  setOppositeUser,
  setOppositeUserName,
} from '../../../actions/customerSupport/actionCreators';

function UsersList() {
  const [usersList, setUsersList] = useState({
    usersRef: firebase.database().ref('users'),
    msgsRef: firebase.database().ref('messages'),
    users: [],
    activeClassID: '',
  });

  const [ChatBox, setchatBox] = useState([]);

  const { usersRef, msgsRef, users, activeClassID } = usersList;
  const loggedUser = useSelector(
    (state) => state.customerSupportReducer.currentUser
  );
  const UserChat = useSelector(
    (state) => state.customerSupportReducer.loggedUserChat
  );
  const OppositeChat = useSelector(
    (state) => state.customerSupportReducer.oppositeUserChat
  );
  const unseenMessages = useSelector(
    (state) => state.customerSupportReducer.unseenMessages
  );

  let dispatch = useDispatch();

  useEffect(() => {
    if (UserChat && OppositeChat) {
      const merge = _.concat(UserChat, OppositeChat);
      const timeUpdate = merge.map((m) => {
        m.timestamp = new Date(m.timestamp);
        return m;
      });
      if (timeUpdate) {
        dispatch(setChatBoxMessage(_.sortBy(timeUpdate, 'timestamp')));
      }
    }

    if (unseenMessages) {
      // console.log(unseenMessages);
    }
  }, [UserChat, OppositeChat]);

  useEffect(() => {
    usersRef.on(
      'value',
      function (snapshot) {
        setUsersList({
          ...usersList,
          users: _.values(snapshot.val()),
        });
      },
      function (error) {
        console.log('Error: ' + error.code);
      }
    );
  }, []);

  const getUserChat = (userID, Name) => {
    setUsersList({ ...usersList, activeClassID: userID });
    dispatch(setOppositeUser(userID));
    dispatch(setOppositeUserName(Name));
    let senderMsg = [];

    //Check First Msg From Client

    // Get Users Message
    msgsRef
      .orderByChild('sender/id')
      .equalTo(loggedUser.uid)
      .on('value', function (snapshot) {
        let msgs = _.values(snapshot.val());
        senderMsg = _.compact(
          _.map(msgs, (m) => {
            if (m.receiver.id === userID) {
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
    msgsRef
      .orderByChild('sender/id')
      .equalTo(`${userID}`)
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
  };

  const handleActiveClass = (id) => {
    setUsersList({ ...usersList, activeClassID: id });
  };

  return (
    <Fragment>
      <div className='col-lg-3 col-md-3 col-sm-6 col-xs-12 col-8 usersbox-container'>
        <div className='users-container'>
          <div className='chat-search-box'>
            <div className='input-group'>
              <input
                className='form-control user-search'
                placeholder='Search'
              />
            </div>
          </div>
          <ul className='users'>
            {users
              ? users.map((userData) => {
                  if (userData.id !== loggedUser.uid)
                    return (
                      <li
                        key={userData.id}
                        className={
                          activeClassID === userData.id
                            ? 'active-user person'
                            : 'person'
                        }
                        data-chat='person1'
                        onClick={(e) => {
                          getUserChat(userData.id, userData.name);
                        }}>
                        <div className='user'>
                          <img
                            src={userData.avatar}
                            className='img-fluid'
                            alt='Retail Admin'
                          />
                          <span className='status busy'></span>
                        </div>
                        <p className='name-time'>
                          <span className='name'>{userData.name}</span>
                          <span className='time'>Active</span>
                        </p>
                        <span className='notify'>2</span>
                      </li>
                    );
                })
              : null}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default UsersList;
