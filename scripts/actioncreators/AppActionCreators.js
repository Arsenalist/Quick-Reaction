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
    jQuery.get( "/mls/box/" + teamId, function( data ) {
        AppActions.setMlsBox(data);
     });
  },
  getNbaBox: function(teamId) {
    jQuery.get( "/nba/box/" + teamId, function( data ) {
        AppActions.setNbaBox(data);
     });
  },
  getMlsPreview: function(teamId) {
    jQuery.get( "/mls/preview/" + teamId, function( data ) {
        AppActions.setMlsPreview(data);
     });
  },
  getPublishOptions: function(type) {
    jQuery.get( "/publish-options/" + type, function( data ) {
        AppActions.setPublishOptions(data);
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
  getNbaReactionHtml: function(teamId, evaluation) {
      var data = {
        team_id: teamId,
        evaluation: evaluation
      }
      jQuery.ajax({
          url: "/nba/generate-reaction",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data)},
          success: function (data) {
              AppActions.setNbaReactionHtml(data);              
          }
      });
  },
  getMlsPreviewHtml: function(teamId, evaluation) {
      var data = {
        team_id: teamId,
        evaluation: evaluation
      }
      jQuery.ajax({
          url: "/mls/generate-preview",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data)},
          success: function (data) {
              AppActions.setMlsPreviewHtml(data);              
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
  createDraft: function(data, publishTarget) {
      jQuery.ajax({
          url: "/create-draft",
          type: "POST",
          dataType: "json",
          data: {data: JSON.stringify(data), publishTarget: publishTarget},
          success: function (data) {
            AppActions.setCreateDraftResult(data);
          }
      });
  }  
}

module.exports = AppActionCreator;