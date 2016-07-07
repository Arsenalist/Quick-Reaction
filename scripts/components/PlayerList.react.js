var Hitter = require('./Hitter.react.js');
var Pitcher = require('./Pitcher.react.js');
var BattingSummary = require('./BattingSummary.react.js');
var Manager = require('./Manager.react.js');
var React = require('react');

var PlayerList = React.createClass({

  render: function() {
    if (typeof this.props.playerRecords == 'undefined' || this.props.playerRecords.length == 0) {
      return <div></div>;
    }

    var hitters, pitchers;
    // TODO: Shouldn't need this check as playerRecords should be []
    var that = this;
    if (this.props.playerRecords != null) {
      hitters = this.props.playerRecords.map(function (player) {
          return <Hitter handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={player}/>
      });
    }
    if (this.props.pitchingRecords != null) {
      pitchers = this.props.pitchingRecords.map(function (player) {
          return <Pitcher handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={player}/>
      });
    }
    return (
      <div className="blurbs">
      <h3>Batting</h3>
      <div className="battingSummary">
        <BattingSummary handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange} data={this.props.playerRecords}/>
      </div>
      <h3>Hitters</h3>
      <div className="playerList">
          {hitters}
      </div>
      <h3>Pitchers</h3>
      <div className="playerList">
          {pitchers}
      </div>
      <h3>Manager</h3>
      <div className="playerList">
          <Manager handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange}  data={this.props.manager}/>
      </div>
      </div>
    );
  }
});
module.exports = PlayerList;