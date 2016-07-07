var Hitter = require('./Hitter.react.js');
var Pitcher = require('./Pitcher.react.js');
var BattingSummary = require('./BattingSummary.react.js');
var BullpenSummary = require('./BullpenSummary.react.js');
var Manager = require('./Manager.react.js');
var FreeForm = require('./FreeForm.react.js');

var React = require('react');
var _ = require('lodash');

var PlayerList = React.createClass({

  render: function() {
    if (typeof this.props.playerRecords == 'undefined' || this.props.playerRecords.length == 0) {
      return <div></div>;
    }

    var hitters, pitchers, bullpenPitchers, bullpenPitchersElements;
    // TODO: Shouldn't need this check as playerRecords should be []
    var that = this;
    if (this.props.playerRecords != null) {
      hitters = this.props.playerRecords.map(function (player) {
          return <Hitter handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={player}/>
      });
    }
    if (this.props.pitchingRecords != null) {
      bullpenPitchers = _.filter(this.props.pitchingRecords, function (player) {return player['sequence'] != 1});
      bullpenPitchersElements = _.map(bullpenPitchers, function (player) {          
          return <Pitcher handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={player}/>
      });
    }
    if (this.props.pitchingRecords != null) {
      var startingPitcher = _.find(this.props.pitchingRecords, function (player) {
            return player['sequence'] == 1;
      });
    }

    var freeForm = [];
    for (var i = 0; i<5; i++) {
      freeForm.push(<FreeForm handleTextChange={this.props.handleTextChange} index={i}/>);
    }

    

    return (
      <div className="blurbs">
      <h3>Starting Pitcher</h3>
      <div className="playerList well">
        <Pitcher handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange}  data={startingPitcher}/>
      </div>
      <h3>Bullpen Summary</h3>
      <div className="bullpenSummary well">
        <BullpenSummary handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange} data={bullpenPitchers}/>
      </div>
      <h3>Batting Summary</h3>
      <div className="battingSummary well">
        <BattingSummary handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange} data={this.props.playerRecords}/>
      </div>
      <h3>Manager</h3>
      <div className="playerList well">
          <Manager handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange}  data={this.props.manager}/>
      </div>
      <h3>Extra Innings</h3>
      <div className="playerList well">
          {{freeForm}}
      </div>      
      <h3>Notable Pitchers</h3>
      <div className="playerList well">
          {bullpenPitchersElements}
      </div>
      <h3>Notable Hitters</h3>
      <div className="playerList well">
          {hitters}
      </div>
      </div>
    );
  }
});
module.exports = PlayerList;