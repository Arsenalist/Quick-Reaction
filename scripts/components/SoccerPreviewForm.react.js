var FreeForm = require('./FreeForm.react.js');
var Participant = require('./Participant.react.js');

var React = require('react');
var _ = require('lodash');

var SoccerPreviewForm = React.createClass({

  renderRecentResults: function(games) {
    var str = '<ul class="list-unstyled">';
    for (var i=0; i<games.length; i++) {
      var g = games[i];
      str += "<li>" + g.home_team.medium_name + " " + g.box_score.score.home.score + ", " + 
        g.away_team.medium_name + " " + g.box_score.score.away.score + "</li>";
    }
    str += "</ul>";
    return str;
  },
  render: function() {
    var nextGame = this.props.nextGame;
    if (nextGame == null) {
      return <div></div>;
    }

    var gameNotes = [];
    for (var i = 1; i<4; i++) {
      gameNotes.push(<FreeForm handleTextChange={this.props.handleTextChange} name={i} id={'gameNotes' + i}/>);
    }

    var winIf = [];
    for (var i = 1; i<4; i++) {
      winIf.push(<FreeForm handleTextChange={this.props.handleTextChange} name={i} id={'winIf' + i}/>);
    }

    var loseIf = [];
    for (var i = 1; i<4; i++) {
      loseIf.push(<FreeForm handleTextChange={this.props.handleTextChange} name={i} id={'loseIf' + i}/>);
    }

    return (
      <div className="blurbs">
      <div className="row">
        <div className="col-xs-6 text-center">
          <h2>{this.props.homeTeam.medium_name}</h2>          
          <strong>Record:</strong> {this.props.homeTeam.standing.short_record} <br/>
          <strong>Last 5:</strong> {this.props.homeTeam.standing.last_five_games_record} <br/>
          <strong>Rank:</strong> {this.props.homeTeam.standing.formatted_rank} <br/>
          <h3>Recent Results</h3>
          <div dangerouslySetInnerHTML={{__html: this.renderRecentResults(this.props.homePreviousGames)}} />

        </div>
        <div className="col-xs-6 text-center">
          <h2>{this.props.awayTeam.medium_name}</h2>          
          <strong>Record:</strong> {this.props.awayTeam.standing.short_record} <br/>
          <strong>Last 5:</strong> {this.props.awayTeam.standing.last_five_games_record} <br/>
          <strong>Rank:</strong> {this.props.awayTeam.standing.formatted_rank}
          <h3>Recent Results</h3>
          <div dangerouslySetInnerHTML={{__html: this.renderRecentResults(this.props.awayPreviousGames)}} />

        </div>
      </div>
      <h3>The Enemy</h3>
      <div className="well">
        <FreeForm handleTextChange={this.props.handleTextChange} id="opponentPreview" name="Blurb"/>
      </div>
      <h3>Manager Take</h3>
      <div className="well">
        <FreeForm handleTextChange={this.props.handleTextChange} id="managerPreview" name="Blurb"/>
      </div>
      <h3>Game Notes</h3>
      <div className="well">
          {gameNotes}
      </div>      
      <h3>Keys to Winning</h3>
      <div className="well">
          {winIf}
      </div>      
      <h3>Keys to Losing</h3>
      <div className="well">
          {loseIf}
      </div>      
      </div>
    );
  }
});
module.exports = SoccerPreviewForm;