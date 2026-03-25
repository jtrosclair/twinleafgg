"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkGolbat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkGolbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zubat';
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sneak Attack',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you play Dark Golbat from your hand, you may choose 1 of your opponent\'s Pokémon. If you do, Dark Golbat does 10 damage to that Pokémon. Apply Weakness and Resistance.'
            }];
        this.attacks = [{
                name: 'Flitter',
                cost: [G, G],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
            }];
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Dark Golbat';
        this.fullName = 'Dark Golbat TR';
        this.QUICK_SHOOTING_MARKER = 'QUICK_SHOOTING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            //const opponent = StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    //const damageEffect = new PutDamageEffect(effect, 10);
                    //store.reduceEffect(state, damageEffect);
                }
                player.marker.addMarker(this.QUICK_SHOOTING_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
        }
        return state;
    }
}
exports.DarkGolbat = DarkGolbat;
