import * as React from 'react'
import { withAuth } from "../lib/AuthProvider";

class Login extends React.Component {
  state = { username: "", password: "" };

  handleFormSubmit = event => {
    event.preventDefault();
    console.log(this.props);
    // const { username, password } = this.state;
    // this.props.login({ username, password });
  };

  handleChange = event => {
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
                width: "50%",
                margin: "4vh auto",
                backgroundColor: "#2ab193e5"
              }}
              type="submit"
              value="Login"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(Login);
