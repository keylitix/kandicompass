import React, { FC, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import Spinner from '../../../components/bootstrap/Spinner';
import { useLoginMutation, useRegisterMutation } from '../../../redux/api/AuthApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../redux/slices/AuthSlice';

interface ILoginHeaderProps {
  isNewUser?: boolean;
}

const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
  if (isNewUser) {
    return (
      <>
        <div className='text-center h1 fw-bold mt-5'>Create Account,</div>
        <div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
      </>
    );
  }
  return (
    <>
      {/* <div className='text-center h1 fw-bold mt-5'>Welcome,</div> */}
      <div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
    </>
  );
};

interface ILoginProps {
  isSignUp?: boolean;
}

const Login: FC<ILoginProps> = ({ isSignUp }) => {
  const { setUser } = useContext(AuthContext);
  const { darkModeStatus } = useDarkMode();
  const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      surname: '',
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (singUpStatus) {
        if (!values.name) errors.name = 'Name is required';
        if (!values.surname) errors.surname = 'Surname is required';
      }
      return errors;
    },
    onSubmit: async (values, { setErrors }) => {
      try {
        if (singUpStatus) {
          // Handle signup
          const res = await register({
            email: values.email,
            password: values.password,
            name: values.name,
            surname: values.surname,
          }).unwrap();
          
          if (res?.statusCode === 201) {
            // Automatically login after successful signup
            const loginRes = await login({ 
              email: values.email, 
              password: values.password 
            }).unwrap();
            
            if (loginRes?.statusCode === 201) {
              dispatch(setCredentials({ user: loginRes?.data, token: loginRes?.data?.token }));
              navigate('/');
            }
          }
        } else {
          // Handle login
          const res = await login({ 
            email: values.email, 
            password: values.password 
          }).unwrap();
          
          if (res?.statusCode === 201) {
            dispatch(setCredentials({ user: res?.data, token: res?.data?.token }));
            navigate('/');
          }
        }
      } catch (error: any) {
        console.error('Auth failed:', error);
        if (error?.data) {
          if (error.data.error?.includes('User not found') || error.data.error?.includes('Email')) {
            setErrors({ email: error.data.error });
          }
          if (error.data.error?.includes('password')) {
            setErrors({ password: error.data.error });
          }
          if (error.data.error?.includes('Name')) {
            setErrors({ name: error.data.error });
          }
          if (error.data.error?.includes('Surname')) {
            setErrors({ surname: error.data.error });
          }
        } else if (error?.error) {
          // Handle CORS or network errors
          setErrors({ email: 'Network error. Please try again.' });
        }
      }
    },
  });

  return (
    <PageWrapper
      isProtected={false}
      title={singUpStatus ? 'Sign Up' : 'Login'}
      className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
      <Page className='p-0'>
        <div className='row h-100 align-items-center justify-content-center'>
          <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
            <Card className='shadow-3d-dark' data-tour='login-page'>
              <CardBody>
                <div className='text-center my-5'>
                  <Link
                    to='/'
                    className={classNames(
                      'text-decoration-none  fw-bold display-2',
                      {
                        'text-dark': !darkModeStatus,
                        'text-light': darkModeStatus,
                      },
                    )}
                    aria-label='Facit'>
                    <Logo width={200} />
                  </Link>
                </div>
                {/* <div
                  className={classNames('rounded-3', {
                    'bg-l10-dark': !darkModeStatus,
                    'bg-dark': darkModeStatus,
                  })}>
                  <div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
                    <div className='col'>
                      <Button
                        color={darkModeStatus ? 'light' : 'dark'}
                        isLight={singUpStatus}
                        className='rounded-1 w-100'
                        size='lg'
                        onClick={() => setSingUpStatus(false)}>
                        Login
                      </Button>
                    </div>
                    <div className='col'>
                      <Button
                        color={darkModeStatus ? 'light' : 'dark'}
                        isLight={!singUpStatus}
                        className='rounded-1 w-100'
                        size='lg'
                        onClick={() => setSingUpStatus(true)}>
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div> */}

                <LoginHeader isNewUser={singUpStatus} />
                
                <form className='row g-4' onSubmit={formik.handleSubmit}>
                  {singUpStatus ? (
                    <>
                      <div className='col-12'>
                        <FormGroup id='email' isFloating label='Your email'>
                          <Input
                            type='email'
                            autoComplete='email'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            isValid={formik.touched.email && !formik.errors.email}
                            isTouched={formik.touched.email}
                            invalidFeedback={formik.errors.email}
                          />
                        </FormGroup>
                      </div>
                      <div className='col-12'>
                        <FormGroup id='name' isFloating label='Your name'>
                          <Input
                            autoComplete='given-name'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            isValid={formik.touched.name && !formik.errors.name}
                            isTouched={formik.touched.name}
                            invalidFeedback={formik.errors.name}
                          />
                        </FormGroup>
                      </div>
                      <div className='col-12'>
                        <FormGroup id='surname' isFloating label='Your surname'>
                          <Input
                            autoComplete='family-name'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.surname}
                            isValid={formik.touched.surname && !formik.errors.surname}
                            isTouched={formik.touched.surname}
                            invalidFeedback={formik.errors.surname}
                          />
                        </FormGroup>
                      </div>
                      <div className='col-12'>
                        <FormGroup id='password' isFloating label='Password'>
                          <Input
                            type='password'
                            autoComplete='new-password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            isValid={formik.touched.password && !formik.errors.password}
                            isTouched={formik.touched.password}
                            invalidFeedback={formik.errors.password}
                          />
                        </FormGroup>
                      </div>
                      <div className='col-12'>
                        <Button
                          color='info'
                          className='w-100 py-3'
                          type='submit'
                          isDisable={isRegistering}>
                          {isRegistering ? (
                            <div className='d-flex align-items-center justify-content-center gap-2'>
                              <Spinner size={20} /> Signing Up...
                            </div>
                          ) : (
                            'Sign Up'
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='col-12'>
                        <FormGroup id='email' isFloating label='Your email' className='mb-4'>
                          <Input
                            type='email'
                            autoComplete='username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            isValid={formik.touched.email && !formik.errors.email}
                            isTouched={formik.touched.email}
                            invalidFeedback={formik.errors.email}
                          />
                        </FormGroup>

                        <FormGroup id='password' isFloating label='Password'>
                          <Input
                            type='password'
                            autoComplete='current-password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            isValid={formik.touched.password && !formik.errors.password}
                            isTouched={formik.touched.password}
                            invalidFeedback={formik.errors.password}
                          />
                        </FormGroup>
                      </div>
                      <div className='col-12'>
                        <Button
                          color='warning'
                          className='w-100 py-3'
                          type='submit'
                          isDisable={isLoggingIn}>
                          {isLoggingIn ? (
                            <div className='d-flex align-items-center justify-content-center gap-2'>
                              <Spinner size={20} /> Logging In...
                            </div>
                          ) : (
                            'Login'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </CardBody>
            </Card>
            <div className='text-center'>
              <a
                href='/'
                className={classNames('text-decoration-none me-3', {
                  'link-light': singUpStatus,
                  'link-dark': !singUpStatus,
                })}>
                Privacy policy
              </a>
              <a
                href='/'
                className={classNames('link-light text-decoration-none', {
                  'link-light': singUpStatus,
                  'link-dark': !singUpStatus,
                })}>
                Terms of use
              </a>
            </div>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Login;