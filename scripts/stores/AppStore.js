var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _teams = [];
var _players = [];
var _lineup = {};
var _formation = null;
var _message = null;
var _location = null
var _mlbReactionHtml = {};
var _mlsReactionHtml = {};
var _createDraftResult = {};
var _mlsBox = {};

var AppStore = assign({}, EventEmitter.prototype, {

  getPlayers: function() {
  	return _players;
  },
  getMlsBox: function() {
    return _mlsBox;
  },
  getMlbReactionHtml: function() {
    return _mlbReactionHtml;
  },
  getMlsReactionHtml: function() {
    return _mlsReactionHtml;
  },
  getTeams: function() {
    return _teams;
  },
  getCreateDraftResult: function() {
    return _createDraftResult;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVE_PLAYERS:
       _players = action.players;
       AppStore.emitChange();
         break;
    case AppConstants.RECEIVE_TEAMS:
       _teams = action.teams;
       AppStore.emitChange();
         break;
    case AppConstants.RECEIVE_MLB_REACTION_HTML:
       _mlbReactionHtml = action.mlbReactionHtml;
      AppStore.emitChange();
         break;
    case AppConstants.RECEIVE_MLS_REACTION_HTML:
       _mlsReactionHtml = action.mlsReactionHtml;
      AppStore.emitChange();
         break;
    case AppConstants.SET_CREATE_DRAFT_RESULT:
      _createDraftResult = action.result;
      AppStore.emitChange();
    case AppConstants.RECEIVE_MLS_BOX:
      _mlsBox = action.box;
      AppStore.emitChange();
    default:
      // no op
  }
});

module.exports = AppStore;