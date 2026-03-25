"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Umbreon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dark Shade',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Team Plasma Pokémon in play gets +20 HP.'
            }];
        this.attacks = [
            {
                name: 'Darkness Fang',
                cost: [D, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon';
        this.fullName = 'Umbreon PLF';
    }
    reduceEffect(store, state, effect) {
        // Ability: Dark Shade (passive - HP boost)
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const targetCard = effect.target.getPokemonCard();
            if (!targetCard || !targetCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                return state;
            }
            // Find the owner of the target
            let targetOwner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList === effect.target) {
                        targetOwner = p;
                    }
                });
            });
            if (!targetOwner) {
                return state;
            }
            // Check if this Umbreon is on the same player's side
            let umbrelonInPlay = false;
            targetOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    umbrelonInPlay = true;
                }
            });
            if (!umbrelonInPlay) {
                return state;
            }
            // Check ability lock
            try {
                const stub = new game_effects_1.PowerEffect(targetOwner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.hp += 20;
        }
        return state;
    }
}
exports.Umbreon = Umbreon;
