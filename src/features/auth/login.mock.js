const mockLogin = async ({ username, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'test01' && password === '123456') {
        resolve({
          data: {
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            user: { username: 'test01' }
          }
        });
      } else if (username === 'test02' && password === '123456') {
        resolve({
          data: {
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            user: { username: 'test02' }
          }
        });
      } else {
        reject({
          response: {
            status: 401,
            data: { message: 'Invalid username or password' }
          }
        });
      }
    }, 1000); // Simulate network delay
  });
};

const mockRegister = async ({ username, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        username === 'register01' &&
        email === 'register01@example.com' &&
        password === '123456'
      ) {
        resolve({
          data: {
            message: 'Registration successful'
          }
        });
      } else {
        reject({
          response: {
            status: 400,
            data: { message: 'Registration failed' }
          }
        });
      }
    }, 1000); // Simulate network delay
  });
};

const mockLogout = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          message: 'Logout successful'
        }
      });
    }, 500); // Simulate network delay
  });
};

export { mockLogin, mockRegister, mockLogout };
