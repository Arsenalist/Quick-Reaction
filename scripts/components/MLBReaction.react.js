var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var TeamSelector = require('./TeamSelector.react.js');
var PlayerList = require('./PlayerList.react.js');
var jQuery = require('jquery/dist/jquery');


var React = require('react');


var MLBReaction = React.createClass({

  getInitialState: function() {
    return (
      {
        player_records: [],
        pitching_records: [],
        manager: {},
        extra: {},
        thinking: false,
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
    this.state.thinking = true;
    this.state.selectedTeam = e.target.value;
    this.setState(this.state);
    AppActionCreator.getPlayers(e.target.value);

  },

  handleGenerate: function(e) {
    AppActionCreator.getMlbReactionHtml(this.state);   
    jQuery("body").scrollTop(0);
  },
  handleTextChange: function(e) {
      console.log(e.target.id, e.target.value);
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
      if (e.target.id == this.state.manager.name) {
        this.state.manager.blurb = e.target.value;
        return;
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
      if (e.target.id == this.state.manager.name) {
        this.state.manager.grade = e.target.value;
      }
      this.state.extra[e.target.id] = e.target.value;      
  },
  _onChange: function() {
    var box = AppStore.getPlayers();
    var html = AppStore.getMlbReactionHtml().html;
    this.setState(
        {
          player_records: box.player_records,
          pitching_records: box.pitching_records,
          manager: box.manager,
          thinking: false,
          html: html
        }
    );
  },


  render: function() { 
    if (this.state.thinking) {
      return (
          <div>Hold up, doing stuff...</div>
      );
    } 
    var generateButton = null;  
    if (typeof this.state.player_records != 'undefined' && this.state.player_records.length != 0) {
      generateButton = <p><input type="button" onClick={this.handleGenerate} className="btn-lg btn-primary btn" value="Generate"/></p>;
    } else {
      generateButton = null;
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
            <div dangerouslySetInnerHTML={{__html: this.state.html}} />
        </div>

      </div>
    );
  }
});

module.exports = MLBReaction;
