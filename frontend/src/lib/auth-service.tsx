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
      .then(({ data }) => data);
  }

  login(user: any) {
    const { username, password } = user;
    return this.auth
      .post('/login', { username, password })
      .then(({ data }) => data);
  }

  logout() {
    return this.auth.post('/logout', {}).then(response => response.data);
  }

  me() {
    return this.auth.get('/me').then(response => response.data);
  }
}

const axiosRequestFunctions = new Auth();

export default axiosRequestFunctions;
