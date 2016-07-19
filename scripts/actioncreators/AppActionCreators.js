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
  getMlsBox: function(teamId) {
    console.log("in mls box ", teamId);
    jQuery.get( "/mls/box/" + teamId, function( data ) {
        console.log("result of call mls box ", data);
        AppActions.setMlsBox(data);
     });
  },
  getTeams: function(league) {
      jQuery.ajax({
          url: "/teams",
          type: "POST",
          dataType: "json",
          data: {league: league},
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
  getMlsReactionHtml: function(teamId, evaluation) {
      var data = {
        team_id: teamId,
        evaluation: evaluation
      }
      jQuery.ajax({
          url: "/mls/generate-reaction",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data)},
          success: function (data) {
              AppActions.setMlsReactionHtml(data);              
          }
      });
  },
  createDraft: function(data) {
      jQuery.ajax({
          url: "/create-draft",
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