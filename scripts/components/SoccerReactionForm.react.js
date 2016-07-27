var FreeForm = require('./FreeForm.react.js');
var Participant = require('./Participant.react.js');

var React = require('react');
var _ = require('lodash');

var SoccerReactionForm = React.createClass({

  renderOutfieldPlayerStats: function(data) {
    return <div>{data.position} | {data.minutes_played} MP | {data.goals} G | {data.assists} A |  {data.shots} ({data.shots_on_goal}) S |  
            {data.corner_kicks} CK | {data.crosses} C |
            {data.yellow_cards}/{data.red_cards} R/Y
            {data.fouls_committed} FC | {data.fouls_suffered} FS</div>
  },

  renderGoalieStats: function(data) {
    return <div>{data.minutes_played} MP | {data.shots_against} ({data.shots_on_goal_against}) SA (OG) | {data.goals_against} GA
            | {data.yellow_cards}/{data.red_cards} R/Y | {data.fouls_committed} FC | {data.fouls_suffered} FS</div>
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
                    metaRenderer={that.renderOutfieldPlayerStats} 
                    data={player}/>
      });
    }
    if (this.props.goalieRecords != null) {
      goalies = this.props.goalieRecords.map(function (player) {
          return <Participant handleTextChange={that.props.handleTextChange} 
                    handleGradeChange={that.props.handleGradeChange} 
                    metaRenderer={that.renderGoalieStats} 
                    data={player}/>
      });
    }

    var freeForm = [];
    for (var i = 1; i<6; i++) {
      freeForm.push(<FreeForm handleTextChange={this.props.handleTextChange} id={'freeForm' + i} name={i}/>);
    }

    

    return (
      <div className="blurbs">
      <h3>Outfield</h3>
      <div className="playerList well">
        {players}
      </div>
      <h3>Goalies</h3>
      <div className="playerList well">
        {goalies}
      </div>
      <h3>Notes</h3>
      <div className="playerList well">
          {freeForm}
      </div>      
      </div>
    );
  }
});
module.exports = SoccerReactionForm;