import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';

function TypingIndicator() {
  const loggedUser = useSelector(
    (state) => state.customerSupportReducer.currentUser
  );
  const UserChat = useSelector(
    (state) => state.customerSupportReducer.loggedUserChat
  );
  const oppositeName = useSelector(
    (state) => state.customerSupportReducer.oppositeUserName
  );

  useEffect(() => {}, []);

  return (
    <Fragment>
      <div className='support-ticontainer'>
        <div className='tiblock'>
          <p>{oppositeName ? oppositeName : null} typing</p>
          <div className='tidot'></div>
          <div className='tidot'></div>
          <div className='tidot'></div>
        </div>
      </div>
    </Fragment>
  );
}

export default TypingIndicator;
