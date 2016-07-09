var React = require('react');
var Grade = require('./Grade.react.js');

var BattingSummary = React.createClass({
  getInitialState: function() {
    return {hitters: this.props.data};
  },
  
  render: function() {
    var hitterRows = this.state.hitters.map(function (p) {
          return (
                <tr>
                    <td>{p.player.first_initial_and_last_name}</td>
                    <td>{p.hits}-{p.at_bats} </td>
                    <td>{p.runs}</td>                    
                    <td>{p.runs_batted_in} </td>
                    <td>{p.walks}</td>
                    <td>{p.strike_outs}</td>
                    <td>{p.doubles}-{p.triples}-{p.home_runs}</td>
                    <td>{p.stolen_bases}</td>
                    <td>{p.short_batting_average}</td>
                    <td>{p.on_base_percentage}</td>
                    <td>{p.slugging_percentage}</td>                    
                </tr>
            )
      });

    return (      
        <div className="row">
            <table className="table table-striped table-bordered table-condensed">
                <tr>
                    <th>Player</th>
                    <th>H-AB</th>
                    <th>R</th>
                    <th>RBI</th>
                    <th>BB</th>
                    <th>SO</th>
                    <th>2B-3B-HR</th>
                    <th>SB</th>
                    <th>AVG</th>
                    <th>OBP</th>
                    <th>Slug</th>                    
                </tr>
                {hitterRows}
            </table>

        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-10">
            <textarea id="battingSummaryBlurb" onChange={this.props.handleTextChange} className="form-control" style={{height: '150px'}}></textarea>
         </div>
         <div className="col-xs-2">
            <Grade id="battingSummaryGrade" handleGradeChange={this.props.handleGradeChange} />
         </div>
        </div>


        </div>
    );
  }
});
module.exports = BattingSummary;