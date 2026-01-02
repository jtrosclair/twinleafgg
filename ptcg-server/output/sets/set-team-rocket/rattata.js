"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rattata = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Rattata extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Trickery',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may switch 1 of your Prizes with the top card of your deck. This power can\'t be used if Rattata is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage; if tails, this attack does 10 damage.'
            }
        ];
        this.set = 'TR';
        this.name = 'Rattata';
        this.fullName = 'Rattata TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.TRICKERY_MARKER = 'TRICKERY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.TRICKERY_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.TRICKERY_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
            prefabs_1.ADD_MARKER(this.TRICKERY_MARKER, player, this);
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false }), prizes => {
                if (prizes && prizes.length > 0) {
                    const temp = player.deck.cards[0];
                    player.deck.cards[0] = prizes[0].cards[0];
                    prizes[0].cards[0] = temp;
                }
            });
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TRICKERY_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
        }
        return state;
    }
}
exports.Rattata = Rattata;
