"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blissey = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blissey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chansey';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Blissful Nurse',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: false,
                text: 'Once during your turn, when you play Blissey from your hand to evolve 1 of your Pokémon, you may remove all damage counters from all of your Pokémon. If you do, discard all Energy attached to those Pokémon that had any damage counters on them.'
            }];
        this.attacks = [{
                name: 'Strength',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Blissey';
        this.fullName = 'Blissey HS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                        if (cardList.damage > 0) {
                            const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                            state = store.reduceEffect(state, healEffect);
                            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                            state = store.reduceEffect(state, checkProvidedEnergy);
                            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList.energies, player.discard, { cards: cards });
                        }
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        return state;
    }
}
exports.Blissey = Blissey;
