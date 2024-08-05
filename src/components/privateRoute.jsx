import { Navigate } from 'react-router-dom';
import React from 'react';
import propTypes from 'prop-types';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../features/auth/authSlice';
// import { history } from '../helpers/history';

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAppSelector(selectAuth);

  return isLoggedIn ? children : <Navigate to="/admin/login" />;

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" state={{ from: history.location }} />;
  // }

  // return children;
}

PrivateRoute.propTypes = {
  children: propTypes.node
};

export { PrivateRoute };
