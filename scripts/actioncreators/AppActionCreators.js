var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppActions = require('../actions/AppActions');
var jQuery = require('jquery/dist/jquery');

var AppActionCreator = {

  getPlayers: function(teamId) {
    jQuery.get( "/mlb/box/" + teamId, function( data ) {
        AppActions.setPlayers(data);
     });
  },
  getTeams: function() {
      jQuery.ajax({
          url: "/mlb/teams",
          type: "GET",
          dataType: "json",
          success: function (data) {
              AppActions.setTeams(data);
          }
      });

  },
  getMlbReactionHtml: function(teamId, evaluation) {
      var data = {
        team_id: teamId,
        evaluation: evaluation
      }
      console.log("making request with ", data)
      jQuery.ajax({
          url: "/mlb/generate-reaction",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data)},
          success: function (data) {
              AppActions.setMlbReactionHtml(data);              
          }
      });
  },
  createMlbDraft: function(data) {
      jQuery.ajax({
          url: "/mlb/create-draft",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data)},
          success: function (data) {
            AppActions.setCreateDraftResult(data);
          }
      });
  }  
}

module.exports = AppActionCreator;