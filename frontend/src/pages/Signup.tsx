import * as React from 'react'
import { Link } from "react-router-dom";
import { withAuth } from "../lib/AuthProvider";

interface SignupProp {
    signup: any
}

class Signup extends React.Component<SignupProp> {
  state = {
    username: "",
    password: "",
    // email: "",
  };

  handleFormSubmit = (event: any) => {
    event.preventDefault();
    const {
      username,
      password,
      
    } = this.state;
     console.log('Signup -> form submit', { username, password });
    this.props.signup({
      username,
      password
    }); 
    // props.signup is Provided by withAuth() and Context API
  };

  handleChange = (event: any) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      username,
      password,
    //   email,
    } = this.state;
    return (
      <div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            padding: "7vh 0"
          }}
        >
          <h1>Sign Up</h1>
          <form onSubmit={this.handleFormSubmit} id="sign-up">
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
            {/* <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            /> */}
            <input
              style={{
                margin: "1.5vh auto",
                backgroundColor: "#2ab193e5"
              }}
              type="submit"
              value="Signup"
            />
          </form>
          <p>Already have account?</p>
          <Link to={"/login"}> Login</Link>
        </div>
      </div>
    );
  }
}

export default withAuth(Signup);
