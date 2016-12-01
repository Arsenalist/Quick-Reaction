var FreeForm = require('./FreeForm.react.js');
var Participant = require('./Participant.react.js');

var React = require('react');
var _ = require('lodash');

var NBAReactionForm = React.createClass({

  renderPlayerStats: function(p) {
    return <div>{p.minutes} MIN, 
                {p.points} PTS, 
                {p.rebounds_total} REB,
                {p.assists} AST,
                {p.field_goals_made-p.field_goals_attempted} FG, 
                {p.three_point_field_goals_made}-{p.three_point_field_goals_attempted} 3FG
                {p.free_throws_made}-{p.free_throws_attempted} FT,
                {p.blocked_shots} BLK,
                {p.turnovers} TO,
                {p.plus_minus} +/-</div>
  },

  render: function() {
    if (typeof this.props.playerRecords == 'undefined' || this.props.playerRecords.length == 0) {
      return <div></div>;
    }

    var players, goalies;
    // TODO: Shouldn't need this check as playerRecords should be []
    var that = this;
    if (this.props.playerRecords != null) {
      players = this.props.playerRecords.map(function (player) {
          return <Participant handleTextChange={that.props.handleTextChange} 
                    handleGradeChange={that.props.handleGradeChange} 
                    metaRenderer={that.renderPlayerStats} 
                    data={player}/>
      });
    }

    var freeForm = [];
    for (var i = 1; i<6; i++) {
      freeForm.push(<FreeForm handleTextChange={this.props.handleTextChange} id={'freeForm' + i} name={i}/>);
    }

    

    return (
      <div className="blurbs">
      <div className="playerList well">
        {players}
      </div>
      <h3>Things we Saw</h3>
      <div className="playerList well">
          {freeForm}
      </div>      
      </div>
    );
  }
});
module.exports = NBAReactionForm;