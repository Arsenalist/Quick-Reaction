var React = require('react');
var Grade = require('./Grade.react.js');

var Participant = React.createClass({
  getInitialState: function() {
    return {player: this.props.data};
  },

  render: function() {
    var data = this.props.data;
    return (
        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-2">
            <img className="img-responsive img-rounded" src={data.player.headshots.w192xh192}/>
            <strong>{data.player.first_initial_and_last_name}</strong>
         </div>
         <div className="col-xs-8">
            <textarea id={data.id} onChange={this.props.handleTextChange} className="form-control" style={{height: '150px'}}></textarea>
            {this.props.metaRenderer(data.player)}
         </div>
         <div className="col-xs-2">
            <Grade id={data.id} handleGradeChange={this.props.handleGradeChange} />
         </div>
        </div>
    );
  }
});
module.exports = Participant;
