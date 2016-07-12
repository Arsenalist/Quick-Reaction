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
  }  
};

module.exports = AppActions;