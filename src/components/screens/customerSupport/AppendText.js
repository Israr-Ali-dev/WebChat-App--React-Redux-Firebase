import React, { Fragment } from 'react';

function AppendText(props) {
  return (
    <Fragment>
      {props.message.map((m) => {
        return (
          <li key={props.avatar} className='chat-right'>
            <div className='chat-text' style={{ whiteSpace: 'pre-wrap' }}>
              {m}
            </div>
            <div className='chat-avatar'>
              <img src={props.avatar} alt='Retail Admin' />
              <div className='chat-name'></div>
            </div>
          </li>
        );
      })}
    </Fragment>
  );
}

export default AppendText;
