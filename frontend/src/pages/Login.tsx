import * as React from 'react'
import { withAuth } from "../lib/AuthProvider";
import { Link } from "react-router-dom";
import '../css/Login.css'

interface LoginProp {
  login: any
}

class Login extends React.Component<LoginProp> {
  state = { username: "", password: "" };

  handleFormSubmit = (event: any) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.login({ username, password });
  };

  handleChange = (event: any) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            paddingBottom: "50vh",
            paddingTop: "20vh"
          }}
        >
          <h1>Login</h1>
          <form onSubmit={this.handleFormSubmit} id="log-in">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <input
              style={{
                margin: "4vh auto",
                backgroundColor: "#2ab193e5"
              }}
              type="submit"
              value="Login"
            />
          </form>
          <p>Don't have an account?</p>
          <Link to={"/signup"}>Signup</Link>
        </div>
      </div>
    );
  }
}

export default withAuth(Login);
