import axios from 'axios';

class Auth {
  auth: any;
  constructor() {
    this.auth = axios.create({
      baseURL: 'http://localhost:8080',
      withCredentials: true,
    });
  }

  signup(user: any) {
    const { username, password} = user;
    return this.auth
      .post('/register', { username, password})
      .then(({ data }) => console.log(data));
  }

  login(user: any) {
    const { username, password } = user;
    return this.auth
      .post('/auth/login', { username, password })
      .then(({ data }) => data);
  }

  logout() {
    return this.auth.post('/auth/logout', {}).then(response => response.data);
  }

  // me() {
  //   return this.auth.get('/auth/me').then(response => response.data);
  // }
}

const axiosRequestFunctions = new Auth();

export default axiosRequestFunctions;
