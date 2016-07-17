
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');


var ReactionPreview = React.createClass({

  getInitialState: function() {
    return {
        thinkingCreatingDraft: false,
        createDraftResult: {}
      };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    var createDraftResult = AppStore.getCreateDraftResult();
    this.setState(
        {
          thinkingCreatingDraft: false,
          createDraftResult: createDraftResult
        }
    );    
  },
  createDraft: function() {
    this.state.thinkingCreatingDraft = true;
    this.setState(this.state);
    AppActionCreator.createDraft(this.props);
  },

  render: function() {
    var createDraftButton = null;
    if (typeof this.props.html != 'undefined') {
      createDraftButton = <p><input type="button" onClick={this.createDraft} className={(this.state.thinkingCreatingDraft ? 'disabled' : '') + " btn-lg btn-primary btn"} value="Create Draft"/></p>;
    }
    var draftLink = null;
    if (this.state.createDraftResult.status == 'OK') {
      draftLink = <a href={this.state.createDraftResult.url} target="_blank">Draft created - click here to view</a>
    }

    return (
      <div><div dangerouslySetInnerHTML={{__html: typeof this.props.html == 'undefined' ? '' : '<textarea onclick="this.select()" style="width:100%">' + this.props.html + '</textarea>'}} />{createDraftButton} {draftLink}<div dangerouslySetInnerHTML={{__html: this.props.html}} /></div>
    );
  }
});
module.exports = ReactionPreview;
