import React, { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/privateRoute';
import { Login } from './features/auth/login';
import LanguagePicker from './components/Language';
import Dashboard from './features/dashboard/dashboard';
import ConfigPage from './features/configPage/configPage';
import { useAppDispatch } from './store/hooks';
import TokenService from './services/token.service';
import GuestUI from './features/templates/guestUI';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = TokenService.getUser();
    if (user) {
      dispatch({ type: 'auth/login/fulfilled', payload: user });
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <div>Content Private</div>
            </PrivateRoute>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="*"
          element={
            <div>
              Not Found
              <Link to="/admin/login">Login</Link>
            </div>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/config-page/:id"
          element={
            <PrivateRoute>
              <ConfigPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<GuestUI />} />
      </Routes>
      <div className="fixed bottom-7 right-20 z-50 shadow-lg hover:shadow-3xl rounded-full ">
        <LanguagePicker />
      </div>
    </div>
  );
}

export default App;
