"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiquePlumeFossil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AntiquePlumeFossil extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.cardTypez = card_types_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.archetype = [];
        this.hp = 60;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.maxTools = 1;
        this.evolvesTo = [];
        this.evolvesToStage = [];
        this.evolvesFromBase = [];
        this.powers = [{
                name: 'Antique Plume Fossil',
                text: `Play this card as if it were a 60-HP [C] Basic Pokémon. This card can't be affected by any Special Conditions and can't retreat.

At any time during your turn, you may discard this card from play.`,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Antique Plume Fossil';
        this.fullName = 'Antique Plume Fossil SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Antique Plume Fossil' });
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.moveCardTo(this, player.discard);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.AntiquePlumeFossil = AntiquePlumeFossil;
