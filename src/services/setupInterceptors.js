import TokenService from './token.service';
import { refreshToken } from '../features/auth/authSlice';
import { http } from './http';
import { httpPublic } from './httpPublic';

const setup = (store) => {
  http.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;
  http.interceptors.response.use(
    (res) => {
      return res;
    },

    async (err) => {
      console.log(http.defaults.headers.common);
      const originalConfig = err.config;

      if (originalConfig.url !== '/auth/signin' && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const token = TokenService.getLocalRefreshToken();
            const rs = await httpPublic.get('/auth/refresh', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            dispatch(refreshToken(rs.data));
            TokenService.updateLocalAccessToken(rs.data.accessToken);
            TokenService.updateLocalRefreshToken(rs.data.refreshToken);

            return http(originalConfig);
          } catch (_error) {
            alert('error');
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
