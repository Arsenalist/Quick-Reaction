var React = require('react');
var Link = require('react-router').Link;

var Main = React.createClass({

  render: function() {
    return (
      <div>
        <div className="list-group">
          <Link to="/baseball/reaction" className="list-group-item">
            <h4 className="list-group-item-heading">Baseball Reaction</h4>
          </Link>
          <Link to="/soccer/reaction" className="list-group-item">
            <h4 className="list-group-item-heading">Soccer Reaction</h4>
          </Link>
          <Link to="/basketball/reaction" className="list-group-item">
            <h4 className="list-group-item-heading">Basketball Reaction</h4>
          </Link>
          <Link to="/soccer/preview" className="list-group-item">
            <h4 className="list-group-item-heading">Soccer Preview</h4>
          </Link>
        </div>
      </div>
    );
  }
});
module.exports = Main;
