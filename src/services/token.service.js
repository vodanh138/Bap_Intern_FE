class TokenService {
  static getLocalRefreshToken() {
    const user = TokenService.getUser();
    return user?.refreshToken;
  }
 
  static getLocalAccessToken() {
    const user = TokenService.getUser();
    return user?.access_token;
  }
 
  static updateLocalRefreshToken(token) {
    let user = TokenService.getUser();
    // user.refreshToken = token;
    // localStorage.setItem('user', JSON.stringify(user));
    user.refreshToken = token;
    sessionStorage.setItem('user', JSON.stringify(user));
  }
 
  static updateLocalAccessToken(token) {
    let user = TokenService.getUser();
    // user.access_token = token;
    // localStorage.setItem('user', JSON.stringify(user));
    user.access_token = token;
    sessionStorage.setItem('user', JSON.stringify(user));
  }
 
  static getUser() {
    // const userStr = localStorage.getItem('user');
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
 
  static setUser(user) {
    // console.log('Setting user to localStorage:', user);
    // localStorage.setItem('user', JSON.stringify(user));
 
    console.log('Setting user to sessionStorage:', user);
    sessionStorage.setItem('user', JSON.stringify(user));
    // Notify other tabs of the user change
    // localStorage.setItem('user', JSON.stringify(user));
  }
 
  static removeUser() {
    // localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    // localStorage.removeItem('user');
  }
}
 
// Listen for user changes in other tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'user') {
    // Handle user change, e.g., refresh user info, update UI, etc.
    const newUser = JSON.parse(event.newValue);
    console.log('User changed across tabs:', newUser);
    // Perform necessary actions to update UI or state
  }
});
 
export default TokenService;