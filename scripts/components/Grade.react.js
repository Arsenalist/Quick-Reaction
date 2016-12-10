
var React = require('react');

var Grade = React.createClass({
  render () {
    var grades = "Inc,F,D-,D,D+,C-,C,C+,B-,B,B+,A-,A,A+".split(",");
    var gradeOptions = grades.map(function (g) {
      return (
        <option value={g}>{g}</option>
      );
    });

    return (
      <div>
        <select id={this.props.id} className="form-control" onChange={this.props.handleGradeChange}>
          <option>Select grade</option>
            {gradeOptions}
        </select>
      </div>
    )
  }
});
module.exports = Grade;
