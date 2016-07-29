
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');


var ReactionPreview = React.createClass({

  getInitialState: function() {
    return {
        thinkingCreatingDraft: false,
        createDraftResult: {},
        publishOptions: []
      };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    AppActionCreator.getPublishOptions(this.props.type);
  },

  _onChange: function() {
    var createDraftResult = AppStore.getCreateDraftResult();
    var publishOptions = AppStore.getPublishOptions();
    this.setState(
        {
          thinkingCreatingDraft: false,
          createDraftResult: createDraftResult,
          publishOptions: publishOptions
        }
    );    
  },
  createDraft: function() {
    this.state.thinkingCreatingDraft = true;
    this.setState(this.state);    
    console.log("this.props", this.props);
    AppActionCreator.createDraft(this.props, this._publishSelect.getDOMNode().value);
  },

  render: function() {
    var createDraftButton = null, publishSelect = null;
    if (typeof this.props.html != 'undefined') {
      createDraftButton = <p><input type="button" onClick={this.createDraft} className={(this.state.thinkingCreatingDraft ? 'disabled' : '') + " btn-lg btn-primary btn"} value="Create Draft"/></p>;
      var publishSelectOptions = this.state.publishOptions.map(function(o) {
          return <option value={o.id}>{o.name}</option>
      });
      publishSelect = <select ref={(c) => this._publishSelect = c} style={{margin: 10 + 'px'}}>{publishSelectOptions}</select>

    }
    var draftLink = null;
    if (this.state.createDraftResult.status == 'OK') {
      draftLink = <a href={this.state.createDraftResult.url} target="_blank">Draft created - click here to view</a>

    }

    return (
      <div><div dangerouslySetInnerHTML={{__html: typeof this.props.html == 'undefined' ? '' : '<textarea onclick="this.select()" style="width:100%">' + this.props.html + '</textarea>'}} />{createDraftButton} {publishSelect} {draftLink}<div dangerouslySetInnerHTML={{__html: this.props.html}} /></div>
    );
  }
});
module.exports = ReactionPreview;
