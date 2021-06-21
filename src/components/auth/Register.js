import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

function Register() {
  const [values, setValues] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    success: false,
    loading: false,
    usersRef: firebase.database().ref('users'),
  });

  const {
    fname,
    lname,
    email,
    password,
    confirmPassword,
    error,
    success,
    usersRef,
    loading,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const isFormValid = () => {
    if (isFormEmpty(fname, lname, password, confirmPassword)) {
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
    if (password.length !== 6 || confirmPassword.length !== 6) {
      return false;
    } else if (password !== confirmPassword) {
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = () => {
    return (
      !fname.length ||
      !lname.length ||
      !password.length ||
      !confirmPassword.length
    );
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: fname,
              photoURL: `https://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
              role: 1,
            })
            .then(() => {
              console.log(createdUser);
              setValues({ ...values, loading: true });
              saveUser(createdUser)
                .then(() => {
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

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      id: createdUser.user.uid,
      email: email,
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
        <Redirect to='/login'></Redirect>
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
                <div className='col-lg-5 d-none d-lg-block bg-register-image'></div>
                <div className='col-lg-7'>
                  <div className='p-5'>
                    <div className='text-center'>
                      <h1 className='h4 text-gray-900 mb-4'>
                        Create an Account!
                      </h1>
                    </div>
                    {error ? showError() : null}
                    {success ? showSuccess() : null}
                    <div className='user'>
                      <div className='form-group row'>
                        <div className='col-sm-6 mb-3 mb-sm-0'>
                          <input
                            type='text'
                            className='form-control form-control-user'
                            id='exampleFirstName'
                            placeholder='First Name'
                            onChange={handleChange('fname')}
                            values={fname}
                          />
                        </div>
                        <div className='col-sm-6'>
                          <input
                            type='text'
                            className='form-control form-control-user'
                            id='exampleLastName'
                            placeholder='Last Name'
                            onChange={handleChange('lname')}
                            values={lname}
                          />
                        </div>
                      </div>
                      <div className='form-group'>
                        <input
                          type='email'
                          className='form-control form-control-user'
                          id='exampleInputEmail'
                          placeholder='Email Address'
                          onChange={handleChange('email')}
                          values={email}
                        />
                      </div>
                      <div className='form-group row'>
                        <div className='col-sm-6 mb-3 mb-sm-0'>
                          <input
                            type='password'
                            className='form-control form-control-user'
                            id='exampleInputPassword'
                            placeholder='Password'
                            onChange={handleChange('password')}
                            values={password}
                          />
                        </div>
                        <div className='col-sm-6'>
                          <input
                            type='password'
                            className='form-control form-control-user'
                            id='exampleRepeatPassword'
                            placeholder='Repeat Password'
                            onChange={handleChange('confirmPassword')}
                            values={confirmPassword}
                          />
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
                          Register Account
                        </span>
                      )}

                      <hr />
                    </div>
                    <hr />

                    <div className='text-center'>
                      <Link to='/login' className='small'>
                        Already have an account? Login!
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

export default Register;
