var AppStore = require('../stores/AppStore.js');
var AppActions = require('../actions/AppActions.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var TeamSelector = require('./TeamSelector.react.js');
var PlayerList = require('./PlayerList.react.js');
var jQuery = require('jquery/dist/jquery');


var React = require('react');


var MLBReaction = React.createClass({

  getInitialState: function() {
    return (
      {
        overview: {},
        player_records: [],
        pitching_records: [],
        manager: {},
        extra: {},
        thinking: false,
        thinkingCreatingDraft: false,
        selectedTeam: '',
        createDraftResult: {}
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
    this.state.thinking = true;
    this.state.selectedTeam = e.target.value;
    this.setState(this.state);
    AppActionCreator.getPlayers(e.target.value);

  },

  handleGenerate: function(e) {
   AppActions.setCreateDraftResult({})
   AppActionCreator.getMlbReactionHtml(this.state);     
    jQuery("body").scrollTop(0);
  },
  handleTextChange: function(e) {
      for (var i = 0; i< this.state.player_records.length; i++) {
        if (e.target.id == this.state.player_records[i].id) {
          this.state.player_records[i].blurb = e.target.value;
          return;
        }
      }
      for (var i = 0; i< this.state.pitching_records.length; i++) {
        if (e.target.id == this.state.pitching_records[i].id) {
          this.state.pitching_records[i].blurb = e.target.value;
          return;
        }
      }
      this.state.extra[e.target.id] = e.target.value;
  },
  handleGradeChange: function(e) {
      for (var i = 0; i< this.state.player_records.length; i++) {
        if (e.target.id == this.state.player_records[i].id) {
          this.state.player_records[i].grade = e.target.value;
          break;
        }
      }
      for (var i = 0; i< this.state.pitching_records.length; i++) {
        if (e.target.id == this.state.pitching_records[i].id) {
          this.state.pitching_records[i].grade = e.target.value;
          break;
        }
      }
      this.state.extra[e.target.id] = e.target.value;      
  },
  createDraft: function() {
    this.state.thinkingCreatingDraft = true;
    this.setState(this.state);
    AppActionCreator.createMlbDraft(this.state);
  },
  _onChange: function() {
    var box = AppStore.getPlayers();
    var html = AppStore.getMlbReactionHtml().html;
    var createDraftResult = AppStore.getCreateDraftResult();
    this.setState(
        {
          overview: box.overview,
          player_records: box.player_records,
          pitching_records: box.pitching_records,
          manager: box.manager,
          thinking: false,
          thinkingCreatingDraft: false,
          html: html,
          createDraftResult: createDraftResult
        }
    );
  },


  render: function() { 
    if (this.state.thinking) {
      return (
          <div>Hold up, doing stuff...</div>
      );
    } 
    var generateButton = null, createDraftButton = null;  
    if (typeof this.state.player_records != 'undefined' && this.state.player_records.length != 0) {
      generateButton = <p><input type="button" onClick={this.handleGenerate} className="btn-lg btn-primary btn" value="Generate"/></p>;
    } else {
      generateButton = null;
    }
    if (typeof this.state.html != 'undefined') {
      createDraftButton = <p><input type="button" onClick={this.createDraft} className={(this.state.thinkingCreatingDraft ? 'disabled' : '') + " btn-lg btn-primary btn"} value="Create Draft"/></p>;
    }
    var draftLink = null;
    if (this.state.createDraftResult.status == 'OK') {
      draftLink = <a href={this.state.createDraftResult.url} target="_blank">Draft created - click here to view</a>
    }


    return (
      <div className="row">      
        <div className="col-xs-6">          
            <TeamSelector selectedTeam={this.state.selectedTeam} handleSelectTeam={this.handleSelectTeam}/>
            <PlayerList 
                handleTextChange={this.handleTextChange} 
                handleGradeChange={this.handleGradeChange} 
                manager={this.state.manager} 
                pitchingRecords={this.state.pitching_records} 
                playerRecords={this.state.player_records}/>
            {generateButton}
                
        </div>
        <div className="col-xs-6">
            <div dangerouslySetInnerHTML={{__html: typeof this.state.html == 'undefined' ? '' : '<textarea onclick="this.select()" style="width:100%">' + this.state.html + '</textarea>'}} />
            {createDraftButton}  
            {draftLink}          
            <div dangerouslySetInnerHTML={{__html: this.state.html}} />
        </div>

      </div>
    );
  }
});

module.exports = MLBReaction;
