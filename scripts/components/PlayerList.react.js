var Participant = require('./Participant.react.js');
var BattingSummary = require('./BattingSummary.react.js');
var BullpenSummary = require('./BullpenSummary.react.js');
var Manager = require('./Manager.react.js');
var FreeForm = require('./FreeForm.react.js');

var React = require('react');
var _ = require('lodash');

var PlayerList = React.createClass({

  renderHitterStats: function(p) {
    return <div>{p.hits}-{p.at_bats} | {p.walks} BB | {p.runs} R | {p.doubles} 2B | 
            {p.triples} 3B | {p.home_runs} HR | {p.strike_outs} K | {p.stolen_bases} SB | AVG: {p.short_batting_average}, OBP: {p.on_base_percentage}, Slug: {p.slugging_percentage})</div>
  },

  renderPitcherStats: function(data) {
    return <div>{data.innings_pitched} IP | {data.runs} ({data.earned_runs}) | {data.hits} H | {data.walks} BB | {data.strike_outs} K | {data.pitch_count} PC, B: {data.balls}, S: {data.strikes}
            | {data.earned_run_average} ERA)</div>
  },

  render: function() {
    if (typeof this.props.playerRecords == 'undefined' || this.props.playerRecords.length == 0) {
      return <div></div>;
    }

    var hitters, pitchers, bullpenPitchers, bullpenPitchersElements;
    // TODO: Shouldn't need this check as playerRecords should be []
    var that = this;
    if (this.props.playerRecords != null) {
      hitters = this.props.playerRecords.map(function (player) {
          return <Participant handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange} metaRenderer={that.renderHitterStats} data={player}/>
      });
    }
    if (this.props.pitchingRecords != null) {
      bullpenPitchers = _.filter(this.props.pitchingRecords, function (player) {return player['sequence'] != 1});
      bullpenPitchersElements = _.map(bullpenPitchers, function (player) {          
          return <Participant handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange} metaRenderer={that.renderPitcherStats} data={player}/>
      });
    }
    if (this.props.pitchingRecords != null) {
      var startingPitcher = _.find(this.props.pitchingRecords, function (player) {
            return player['sequence'] == 1;
      });
    }

    var freeForm = [];
    for (var i = 1; i<6; i++) {
      freeForm.push(<FreeForm handleTextChange={this.props.handleTextChange} id={'freeForm' + i} name={i}/>);
    }

    

    return (
      <div className="blurbs">
      <h3>Starting Pitcher</h3>
      <div className="playerList well">
        <Participant handleTextChange={that.props.handleTextChange} handleGradeChange={that.props.handleGradeChange} metaRenderer={this.renderPitcherStats}  data={startingPitcher}/>
      </div>
      <h3>Batting Summary</h3>
      <div className="battingSummary well">
        <BattingSummary handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange} data={this.props.playerRecords}/>
      </div>
      <h3>Bullpen Summary</h3>
      <div className="bullpenSummary well">
        <BullpenSummary handleTextChange={this.props.handleTextChange} handleGradeChange={this.props.handleGradeChange} data={bullpenPitchers}/>
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