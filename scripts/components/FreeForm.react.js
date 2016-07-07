var React = require('react');

var FreeForm = React.createClass({
  render: function() {
    if (typeof this.props.index == 'undefined') return <div></div>;
    return (      
        <div className="row" style={{marginTop: 10 + 'px'}}>
         <div className="col-xs-1">{this.props.index + 1}</div>
         <div className="col-xs-11">
            <textarea id={"freeForm" + this.props.index} onChange={this.props.handleTextChange} className="form-control" style={{height: '150px'}}></textarea>
         </div>
        </div>
    );
  }
});
module.exports = FreeForm;
