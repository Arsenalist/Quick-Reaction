var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {string} text
   */
  setPlayers: function(players) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_PLAYERS,
      players: players
    });
  },
  setMlsBox: function(box) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_MLS_BOX,
      box: box
    });
  },
  setMlsPreview: function(preview) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_MLS_PREVIEW,
      preview: preview
    });
  },
  setTeams: function(teams) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_TEAMS,
      teams: teams
    });
  },
  setMlbReactionHtml: function(mlbReactionHtml) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_MLB_REACTION_HTML,
      mlbReactionHtml: mlbReactionHtml
    });
  },
  setMlsPreviewHtml: function(mlsPreviewHtml) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_MLS_PREVIEW_HTML,
      mlsPreviewHtml: mlsPreviewHtml
    });
  },
  setMlsReactionHtml: function(mlsReactionHtml) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_MLS_REACTION_HTML,
      mlsReactionHtml: mlsReactionHtml
    });
  },
  setCurrentTeam: function(team) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_CURRENT_TEAM,
      team: team
    });
  },
  setCreateDraftResult: function(createDraftResult) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_CREATE_DRAFT_RESULT,
      result: createDraftResult
    });
  },
  setPublishOptions: function(publishOptions) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_PUBLISH_OPTIONS,
      publishOptions: publishOptions
    });
  }    
};

module.exports = AppActions;