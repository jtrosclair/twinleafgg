"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Conductive Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, its Retreat Cost is [C] less for each Magnemite on your Bench.'
            }];
        this.attacks = [
            {
                name: 'Lightning Ball',
                cost: [C, C],
                damage: 20,
                text: '',
            }
        ];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite BKT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            let isMagnemiteInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isMagnemiteInPlay = true;
                }
            });
            if (!isMagnemiteInPlay) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const magnemiteCount = player.bench.reduce((count, benchCard) => {
                    const benchPokemon = benchCard.getPokemonCard();
                    return benchPokemon && benchPokemon.name === this.name ? count + 1 : count;
                }, 0);
                for (let i = 0; i < magnemiteCount; i++) {
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
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 10;
                }
                if (result === false) {
                    const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                    dealDamage.target = player.active;
                    return store.reduceEffect(state, dealDamage);
                }
            });
        }
        return state;
    }
}
exports.Magnemite = Magnemite;
