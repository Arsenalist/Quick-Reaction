var FreeForm = require('./FreeForm.react.js');
var SoccerOutfieldPlayer = require('./SoccerOutfieldPlayer.react.js');

var React = require('react');
var _ = require('lodash');

var SoccerReactionForm = React.createClass({

  render: function() {
    if (typeof this.props.playerRecords == 'undefined' || this.props.playerRecords.length == 0) {
      return <div></div>;
    }

    var players, goalies;
    // TODO: Shouldn't need this check as playerRecords should be []
    var that = this;
    if (this.props.playerRecords != null) {
      players = this.props.playerRecords.map(function (player) {
          return <SoccerOutfieldPlayer handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={player}/>
      });
    }

    var freeForm = [];
    for (var i = 0; i<5; i++) {
      freeForm.push(<FreeForm handleTextChange={this.props.handleTextChange} index={i}/>);
    }

    

    return (
      <div className="blurbs">
      <h3>Outfield</h3>
      <div className="playerList well">
        {players}
      </div>
      <h3>Notes</h3>
      <div className="playerList well">
          {{freeForm}}
      </div>      
      </div>
    );
  }
});
module.exports = SoccerReactionForm;