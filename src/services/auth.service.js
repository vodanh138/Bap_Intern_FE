import TokenService from './token.service';
import { http } from './http';

class AuthService {
  // Define static methods as they do not use `this`
  static async login(username, password) {
    try {
      const response = await http.post('/login', {
        username,
        password
      });
      if (response.data.status === 'success') {
        TokenService.setUser(response.data.data);
        return response.data;
      }
      throw new Error(response.data.message); // No need for an `else` here
    } catch (error) {
      console.log('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed!');
    }
  }

  static logout() {
    TokenService.removeUser();
    return http.post('/logout');
  }

  static async getProfile() {
    try {
      return await http.get('/profile');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }
}

export default AuthService;
