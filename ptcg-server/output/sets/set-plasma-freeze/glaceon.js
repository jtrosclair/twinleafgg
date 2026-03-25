"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glaceon = void 0;
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Glaceon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Freeze Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'The Retreat Cost of each of your Team Plasma Pokémon in play is ColorlessColorless less.'
            }];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [W, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glaceon';
        this.fullName = 'Glaceon PLF';
    }
    reduceEffect(store, state, effect) {
        // Ability: Freeze Zone (passive - retreat cost reduction)
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            // Check if this Glaceon is in play on this player's side
            let isInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isInPlay = true;
                }
            });
            if (!isInPlay) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Check if the retreating Pokemon is a Team Plasma Pokemon
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                // Remove up to 2 Colorless from cost
                for (let i = 0; i < 2; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index >= 0) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        // Attack: Icy Wind
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Glaceon = Glaceon;
