import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Games } from '../../../lib/collections';

export default class NewGameCntrl extends Controller {
  constructor() {
    super(...arguments); 
  }

  newGame(userId) {
    let game = Games.findOne({ userIds: { $all: [this.currentUserId, userId] } });

    if (game) {
      this.hideNewGameModal();
      return this.goToGame(game._id);
    }

    this.callMethod('newGame', userId, (err, gameId) => {
      this.hideNewGameModal();
      if (err) return this.handleError(err);
      this.goToGame(gameId);
    });
  }

  hideNewGameModal() {
    this.NewGame.hideModal();
  }

  goToGame(gameId) {
    this.$state.go('tab.game', { gameId });
  }

  handleError(err) {
    this.$log.error('New game creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New game creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

NewGameCntrl.$name = 'NewGameCntrl';
NewGameCntrl.$inject = ['$state', 'NewGame', '$ionicPopup', '$log'];