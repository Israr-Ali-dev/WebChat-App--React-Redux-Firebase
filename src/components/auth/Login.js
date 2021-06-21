import React, { Fragment, useState } from 'react';
import firebase from 'firebase';
import { Link, Redirect } from 'react-router-dom';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
  });

  const { email, password, error, success, loading } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setValues({
        ...values,
        laoding: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          setValues({
            ...values,
            success: true,
          });
        })
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

  const isFormValid = () => {
    if (!email.length || !password.length) {
      setValues({ ...values, error: 'Please Fill All Fields' });
      return false;
    } else {
      return true;
    }
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

  return (
    <Fragment>
      <div className='container'>
        {/* Outer Row */}
        <div className='row justify-content-center'>
          <div className='card o-hidden border-0 shadow-lg my-5'>
            <div className='card-body p-0'>
              {/* Nested Row within Card Body */}
              <div className='row'>
                <div className='col-lg-6 d-none d-lg-block bg-login-image'></div>
                <div className='col-lg-6'>
                  <div className='p-5'>
                    <div className='text-center'>
                      <h1 className='h4 text-gray-900 mb-4'>Welcome Back!</h1>
                    </div>
                    {error ? showError() : null}
                    {success ? showSuccess() : null}
                    <div className='user'>
                      <div className='form-group'>
                        <input
                          type='email'
                          className='form-control form-control-user'
                          id='exampleInputEmail'
                          aria-describedby='emailHelp'
                          placeholder='Enter Email Address...'
                          onChange={handleChange('email')}
                          value={email}
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type='password'
                          className='form-control form-control-user'
                          id='exampleInputPassword'
                          placeholder='Password'
                          onChange={handleChange('password')}
                          value={password}
                        />
                      </div>
                      <div className='form-group'>
                        <div className='custom-control custom-checkbox small'>
                          <input
                            type='checkbox'
                            className='custom-control-input'
                            id='customCheck'
                          />
                          {/* <label
                            className='custom-control-label'
                            forhtml='customCheck'>
                            Remember Me
                          </label> */}
                        </div>
                      </div>
                      {loading ? (
                        <button
                          class='btn btn-primary btn-user btn-block'
                          type='button'
                          disabled>
                          <span
                            class='spinner-border spinner-border-sm'
                            role='status'
                            aria-hidden='true'></span>
                        </button>
                      ) : (
                        <span
                          className='btn btn-primary btn-user btn-block'
                          onClick={clickSubmit}>
                          Login
                        </span>
                      )}
                    </div>
                    <hr />
                    <div className='text-center'>
                      <Link to='/register' className='small'>
                        Create an Account!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
