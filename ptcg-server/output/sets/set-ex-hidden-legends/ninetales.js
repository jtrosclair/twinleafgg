"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninetales extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vulpix';
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Safeguard',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Prevent all effects of attacks, including damage, done to Ninetales by your opponent\'s Pokémon-ex.'
            }];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
            },
            {
                name: 'Will-o\'-the-wisp',
                cost: [R, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'HL';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ninetales';
        this.fullName = 'Ninetales HL';
    }
    reduceEffect(store, state, effect) {
        // Prevent damage from Pokemon-ex
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(game_1.CardTag.POKEMON_ex)) {
                effect.preventDefault = true;
            }
        }
        // Handle Quick Attack coin flip
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Flip a coin
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    effect.damage += 20; // 20 base + 20 for heads
                }
                return state;
            });
        }
        return state;
    }
}
exports.Ninetales = Ninetales;
