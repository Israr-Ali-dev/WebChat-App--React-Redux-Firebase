import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';

function TypingIndicator() {
  const loggedUser = useSelector((state) => state.clientReducer.clientUser);
  const UserChat = useSelector((state) => state.clientReducer.loggedUserChat);
  const oppositeName = useSelector(
    (state) => state.clientReducer.oppositeUserName
  );

  useEffect(() => {}, []);

  return (
    <Fragment>
      <div className='client-ticontainer'>
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
