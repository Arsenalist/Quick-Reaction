var React = require('react');

var Grade = require('./Grade.react.js');


var Manager = React.createClass({
  getInitialState: function() {
    return {player: this.props.data};
  },
  
  render: function() {
    var data = this.props.data;
    return (      
        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-2">
            <img className="img-responsive img-rounded" src={data.image}/>
            <strong>{data.name}</strong>
         </div>
         <div className="col-xs-8">
            <textarea id={data.name} onChange={this.props.handleTextChange}  className="form-control" style={{height: '150px'}}></textarea>
         </div>
         <div className="col-xs-2">
            <Grade id={data.name} handleGradeChange={this.props.handleGradeChange}/>
         </div>
        </div>
    );
  }
});
module.exports = Manager;
