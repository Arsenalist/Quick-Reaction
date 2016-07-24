var AppStore = require('../stores/AppStore.js');
var AppActions = require('../actions/AppActions.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var TeamSelector = require('./TeamSelector.react.js');
var PlayerList = require('./PlayerList.react.js');
var ReactionPreview = require('./ReactionPreview.react.js');
var SoccerReactionForm = require('./SoccerReactionForm.react.js');
var EvaluationRecorderMixin = require('../mixins/EvaluationRecorderMixin.react.js');

var jQuery = require('jquery/dist/jquery');


var React = require('react');


var MLSReaction = React.createClass({

  mixins: [EvaluationRecorderMixin],

  getInitialState: function() {
    return (
      {
        overview: {},
        player_records: [],
        goalie_records: [],
        evaluation: {
          blurbs: {},
          grades: {}
        },
        manager: {},
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
    AppActionCreator.getMlsBox(e.target.value);

  },

  handleGenerate: function(e) {
   //AppActions.setCreateDraftResult({}) // TODO: Fix this magic
   AppActionCreator.getMlsReactionHtml(this.state.selectedTeam, this.state.evaluation);     
   this.state.thinkingGenerateReaction = true;
   this.setState(this.state);
   jQuery("body").scrollTop(0);
  },

  _onChange: function() {
    var box = AppStore.getMlsBox();
    var html = AppStore.getMlsReactionHtml().html;
    this.setState(
        {
          overview: box.overview,
          player_records: box.player_records,
          goalie_records: box.goalie_records,
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
    if (typeof this.state.player_records != 'undefined' && this.state.player_records.length != 0) {
      generateButton = <p><input type="button"  style={{margin: 10 + 'px'}}  onClick={this.handleGenerate} className="btn-lg btn-primary btn btn-block" value="Generate"/></p>;
    } else {
      generateButton = null;
    }
    var rightSide = null;
    if (this.state.thinkingGenerateReaction) {
      rightSide = <div>Generating reaction...</div>
    } else {
      rightSide = <ReactionPreview type="mls-reaction" context={this.state.overview} html={this.state.html} />
    }

    return (
      <div>
      <h1>Soccer Reaction</h1>
      <div className="row">      
        <div className="col-xs-6">          
            <TeamSelector league="mls" selectedTeam={this.state.selectedTeam} handleSelectTeam={this.handleSelectTeam}/>
            {generateButton}
            <SoccerReactionForm 
                handleTextChange={this.handleTextChange} 
                handleGradeChange={this.handleGradeChange} 
                playerRecords={this.state.player_records}
                goalieRecords={this.state.goalie_records}/>
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

module.exports = MLSReaction;
