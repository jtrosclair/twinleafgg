"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beldum = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beldum extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Conductive Body',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Beldum is your Active Pokémon, you pay [C] less to retreat Beldum for each Beldum on your Bench.'
            }];
        this.attacks = [
            {
                name: 'Take Down',
                cost: [L, C],
                damage: 30,
                text: 'Beldum does 10 damage to itself.',
            }
        ];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Beldum';
        this.fullName = 'Beldum DS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            let isBeldumInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isBeldumInPlay = true;
                }
            });
            if (!isBeldumInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const BeldumCount = player.bench.reduce((count, benchCard) => {
                    const benchPokemon = benchCard.getPokemonCard();
                    return benchPokemon && benchPokemon.name === this.name ? count + 1 : count;
                }, 0);
                console.log('BeldumCount', BeldumCount);
                for (let i = 0; i < BeldumCount; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Beldum = Beldum;
