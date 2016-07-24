
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var Navigation = require('react-router').Navigation;


var TeamSelector = React.createClass({
  mixins: [Navigation],


  getInitialState: function() {
    return {
        teams: []
      };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    AppActionCreator.getTeams(this.props.league);
  },

  _onChange: function() {
    this.state.teams = AppStore.getTeams();
    this.setState(this.state);
  },

  render: function() {
    var options = [];
    for (var i=0; i<this.state.teams.length; i++) {
      options.push(<option value={this.state.teams[i].id}>{this.state.teams[i].full_name}</option>);
    }

    return (
      <div className="teamSelector">
        <select value={this.props.selectedTeam} onChange={this.props.handleSelectTeam}>
          <option value=''>Select a team</option>
          {options}
        </select>
      </div>
    );
  }
});
module.exports = TeamSelector;
