"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkVileplume = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DarkVileplume extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dark Gloom';
        this.tags = [game_1.CardTag.DARK];
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Hay Fever',
                powerType: game_2.PowerType.POKEMON_POWER,
                text: 'No Trainer cards can be played. This power stops working while Dark Vileplume is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Petal Whirlwind',
                cost: [G, G, G],
                damage: 10,
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads. If you get 2 or more heads, Dark Vileplume is now Confused (after doing damage).'
            },
        ];
        this.set = 'TR';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Vileplume';
        this.fullName = 'Dark Vileplume TR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayItemEffect ||
            effect instanceof play_card_effects_1.PlaySupporterEffect ||
            effect instanceof play_card_effects_1.PlayStadiumEffect ||
            effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let vileplumeInPlay = false;
            // Checking to see if ability is being blocked
            if (prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            // Checks for Vileplume in play on Player's Turn
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    vileplumeInPlay = true;
                }
                if (!vileplumeInPlay) {
                    return state;
                }
                if (vileplumeInPlay) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            });
            // Checks for Vileplume in play on Opponent's Turn (opponent of the owner of this card)
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    vileplumeInPlay = true;
                }
                if (!vileplumeInPlay) {
                    return state;
                }
                if (vileplumeInPlay) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 30 * heads;
                if (heads >= 2) {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
                }
            });
        }
        return state;
    }
}
exports.DarkVileplume = DarkVileplume;
