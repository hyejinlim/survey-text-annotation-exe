import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

const Authmiddleware = (props: any) => {
  if (!localStorage.getItem('token')) {
    return <Navigate to={{ pathname: '/login' }} />;
  }
  return <Fragment>{props.children}</Fragment>;
};

export default Authmiddleware;
