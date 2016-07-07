var React = require('react');
var Grade = require('./Grade.react.js');

var BullpenSummary = React.createClass({
  getInitialState: function() {
    return {pitchers: this.props.data};
  },
  
  render: function() {
    console.log("pitchers is ", this.state.pitchers);
    var pitcherRows = this.state.pitchers.map(function (p) {
          return (
                <tr>
                    <td>{p.player.first_initial_and_last_name}</td>
                    <td>{p.innings_pitched}</td>
                    <td>{p.runs}</td>                    
                    <td>{p.earned_runs} </td>
                    <td>{p.hits}</td>
                    <td>{p.walks}</td>
                    <td>{p.strike_outs}</td>
                    <td>{p.pitch_count}</td>
                </tr>
            )
      });

    return (      
        <div className="row">
            <table className="table table-striped table-bordered table-condensed">
                <tr>
                    <th>Player</th>
                    <th>IP</th>
                    <th>R</th>
                    <th>ER</th>
                    <th>H</th>
                    <th>BB</th>
                    <th>SO</th>
                    <th>PC</th>
                </tr>
                {pitcherRows}
            </table>

        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-10">
            <textarea id="bullpenSummaryBlurb" onChange={this.props.handleTextChange} className="form-control" style={{height: '150px'}}></textarea>
         </div>
         <div className="col-xs-2">
            <Grade id="bullpenSummaryGrade" handleGradeChange={this.props.handleGradeChange} />
         </div>
        </div>


        </div>
    );
  }
});
module.exports = BullpenSummary;