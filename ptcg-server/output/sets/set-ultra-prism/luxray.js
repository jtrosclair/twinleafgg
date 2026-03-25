"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = L;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Intimidating Fang',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Active Pokémon\'s attacks do 30 less damage (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Volt Bolt',
                cost: [L, L, C],
                damage: 0,
                text: 'Discard all [L] Energy from this Pokémon. This attack does 150 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Luxray';
        this.fullName = 'Luxray UPR';
    }
    reduceEffect(store, state, effect) {
        // Ability: Intimidating Fang (passive - reduce opponent's attack damage by 30)
        // Ref: AGENTS-patterns.md (Damage Prevention/Reduction)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            // Only reduce damage from opponent's attacks
            if (player === opponent) {
                return state;
            }
            // Only works when this Pokemon is active
            if (player.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        // Attack 1: Volt Bolt
        // Ref: set-primal-clash/manectric.ts (discard all [L] Energy), set-breakpoint/ferrothorn.ts (damage to 1 of opponent's Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Discard all [L] Energy from this Pokemon
            const cards = player.active.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.provides.includes(card_types_1.CardType.LIGHTNING));
            cards.forEach(c => { player.active.moveCardTo(c, player.discard); });
            // This attack does 150 damage to 1 of opponent's Pokemon
            (0, attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(150, effect, store, state);
        }
        return state;
    }
}
exports.Luxray = Luxray;
