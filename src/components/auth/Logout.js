import React, { Fragment } from 'react';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

function Logout() {
  let history = useHistory();

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => history.push('/login'));
  };

  return (
    <Fragment>
      {/* Logout Modal */}
      <div
        className='modal fade'
        id='logoutModal'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Ready to Leave?
              </h5>
              <button
                className='close'
                type='button'
                data-dismiss='modal'
                aria-label='Close'>
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <div className='modal-body'>
              Select "Logout" below if you are ready to end your current
              session.
            </div>
            <div className='modal-footer'>
              <button
                className='btn btn-secondary'
                type='button'
                data-dismiss='modal'>
                Cancel
              </button>
              <span
                className='btn btn-primary'
                onClick={handleLogout}
                data-dismiss='modal'>
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Logout;
