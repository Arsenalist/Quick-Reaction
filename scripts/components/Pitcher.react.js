var React = require('react');
var Grade = require('./Grade.react.js');

var Pitcher = React.createClass({
  getInitialState: function() {
    return {player: this.props.data};
  },
  
  render: function() {
    if (typeof this.props.data == 'undefined') return <div></div>;
    var data = this.props.data;
    return (      
        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-2">
            <img className="img-responsive img-rounded" src={data.player.headshots.w192xh192}/>
            <strong>{data.player.first_initial_and_last_name} ({data.record})</strong>
         </div>
         <div className="col-xs-8">
            <textarea id={data.id} onChange={this.props.handleTextChange} className="form-control" style={{height: '150px'}}></textarea>
            {data.innings_pitched} IP | {data.runs} ({data.earned_runs}) | {data.hits} H | {data.walks} BB | {data.strike_outs} K | {data.pitch_count} PC, B: {data.balls}, S: {data.strikes}
            | {data.earned_run_average} ERA
         </div>
         <div className="col-xs-2">
            <Grade id={data.id} handleGradeChange={this.props.handleGradeChange}/>
         </div>
        </div>
    );
  }
});
module.exports = Pitcher;
