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

var AppStore = assign({}, EventEmitter.prototype, {

  getPlayers: function() {
  	return _players;
  },
  getMlbReactionHtml: function() {
    return _mlbReactionHtml;
  },
  getTeams: function() {
    return _teams;
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
    default:
      // no op
  }
});

module.exports = AppStore;