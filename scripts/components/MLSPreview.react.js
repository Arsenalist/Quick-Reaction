var AppStore = require('../stores/AppStore.js');
var AppActions = require('../actions/AppActions.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var TeamSelector = require('./TeamSelector.react.js');
var ReactionPreview = require('./ReactionPreview.react.js');
var SoccerPreviewForm = require('./SoccerPreviewForm.react.js');
var EvaluationRecorderMixin = require('../mixins/EvaluationRecorderMixin.react.js');


var jQuery = require('jquery/dist/jquery');


var React = require('react');


var MLSPreview = React.createClass({

  mixins: [EvaluationRecorderMixin],

  getInitialState: function() {
    return (
      {
        nextGame: null,
        homePreviousGames: [],
        awayPreviousGames : [],
        eventDetails: {},
        homeTeam: {},
        awayTeam: {},
        evaluation: {
          blurbs: {}
        },
        thinkingTeamSelect: false,
        thinkingGenerateReaction: false,
        selectedTeam: ''
      }
    );
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },


  handleSelectTeam: function(e) {  
    e.preventDefault();
    if (e.target.value == '') return false;
    this.state.thinkingTeamSelect = true;
    this.state.selectedTeam = e.target.value;
    this.setState(this.state);
    AppActionCreator.getMlsPreview(e.target.value);

  },

  handleGenerate: function(e) {
   AppActionCreator.getMlsPreviewHtml(this.state.selectedTeam, this.state.evaluation);     
   this.state.thinkingGenerateReaction = true;
   this.setState(this.state);
   jQuery("body").scrollTop(0);
  },

  _onChange: function() {
    var preview = AppStore.getMlsPreview();
    var html = AppStore.getMlsPreviewHtml().html;

    this.setState(
        {
          nextGame: preview.next_game,
          homePreviousGames: preview.home_previous_games,
          awayPreviousGames: preview.away_previous_games,
          homeTeam: preview.home_team,
          awayTeam: preview.away_team,
          eventDetails: preview.event_details,
          thinkingTeamSelect: false,
          thinkingGenerateReaction: false,
          html: html
        }
    );
  },


  render: function() { 
    if (this.state.thinkingTeamSelect) {
      return (
          <div>Hold up, doing stuff...</div>
      );
    } 
    var generateButton = null, createDraftButton = null;  
    if (this.state.nextGame != null) {
      generateButton = <p><input type="button"  style={{margin: 10 + 'px'}}  onClick={this.handleGenerate} className="btn-lg btn-primary btn btn-block" value="Generate"/></p>;
    } else {
      generateButton = null;
    }
    var rightSide = null;
    if (this.state.thinkingGenerateReaction) {
      rightSide = <div>Generating reaction...</div>
    } else {
      rightSide = <ReactionPreview type="mls-preview" html={this.state.html} />
    }

    return (
      <div>
      <h1>Soccer Preview</h1>
      <div className="row">      
        <div className="col-xs-6">          
            <TeamSelector league="mls" selectedTeam={this.state.selectedTeam} handleSelectTeam={this.handleSelectTeam}/>
            {generateButton}
            <SoccerPreviewForm 
                handleTextChange={this.handleTextChange} 
                nextGame={this.state.nextGame}
                awayPreviousGames={this.state.awayPreviousGames}
                homePreviousGames={this.state.homePreviousGames}
                homeTeam={this.state.homeTeam}
                awayTeam={this.state.awayTeam}
                eventDetails={this.state.eventDetails}/>
            {generateButton}
                
        </div>
        <div className="col-xs-6">
            {rightSide}            
        </div>
      </div>
      </div>
    );
  }
});

module.exports = MLSPreview;
