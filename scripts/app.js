
var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var MLBReaction = require('./components/MLBReaction.react.js');
var App = require('./components/App.react.js');
// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="/" handler={MLBReaction}/>
  </Route>
);

ReactRouter.run(routes, ReactRouter.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById('content'));
});
