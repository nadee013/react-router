var React = require('react');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var blogs = [];
var fetchUrl = fetch('http://localhost:4000');

var Home = React.createClass({
  getInitialState: function() {
    return {
      "stateBlogs": blogs,
      "currPage": "home"
    }
  },
  componentWillMount: function() {
    var self = this;
    fetchUrl.then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(posts) {
      blogs = posts;
      self.setState({"stateBlogs": blogs});
    });
  },
  goHome () {
    this.setState({"currPage": "home"});
  },
  gotoBlogPage (pageData) {
    this.setState({"currData": pageData});
    this.setState({"currPage": "blogPage"});
  },
  render: function() {
    var state = this.state;
    if(state && state.currPage && state.currPage === "blogPage") {
      return <BlogPage onBackClick={this.goHome} pageData={this.state.currData}/>
    } else {
      return <BlogsList onPageClick={this.gotoBlogPage} blogs={this.state.stateBlogs}/>
    }
  }
});

var BlogsList = React.createClass({
  clickBlog (pageData) {
    this.props.onPageClick(pageData);
  },
  render: function() {
    var self = this;
    // console.log(self);
    return (
      <div>
        <h1>Blogs List</h1>
        <ul> {
          self.props.blogs.map(function(item) {
            return (
              <li>
                <a href="#" onClick={self.clickBlog.bind(self, item)}>{item.name}</a>
              </li>
            )
          })
        }
        </ul>
      </div>
    );
  }
});

var BlogPage = React.createClass({
  clickBack () {
    this.props.onBackClick();
  },
  render: function() {
    return (
      <div>
        <a href="#" onClick={this.clickBack}>Back to home</a>
        <h1>{this.props.pageData.name}</h1>
      </div>
    )
  }
});

React.render(
  <Home/>,
  document.getElementById('root')
)