import * as React from "react";
import '../css/Search.css'

class SearchBar extends React.Component {
  state = {
    users: [],
    input: "",
    selected: [],
    themes: [],
    selectedThemes: [],
    referrer: ""
  };

  handleSearch = (e) => {
    const { value } = e.target;
    this.setState({input: value})
  }

  searchSubmit = (e) => {
    // this.props.submit(e, this.state.input);
    this.setState({input: ''});
  }

  goHome = () => {
    this.setState({referrer: '/'});
  }

  render() {
    return (
       <form onSubmit={(e) => this.searchSubmit(e)} id="search-bar">
        <label htmlFor="search-input" className="hidden"></label>
        <input
          id="search-input"
          type="search"
          onChange={this.handleSearch}
          value={this.state.input}
          placeholder="Search..."
        />
        <button type="submit" id="search-button">
          Search
        </button>
        </form>
    );
  }
}

export default SearchBar;
