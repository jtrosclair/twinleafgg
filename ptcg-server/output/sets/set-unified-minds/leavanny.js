"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leavanny = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Leavanny extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Swadloon';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Blanket Weaver',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your [G] Pokémon take 40 less damage from your opponent\'s attacks (after applying Weakness and Resistance). You can\'t apply more than 1 Blanket Weaver Ability at a time.'
            }];
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [G, C],
                damage: 70,
                text: ''
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Leavanny';
        this.fullName = 'Leavanny UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            // Check if Leavanny is actually in play for "player"
            const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            // Check if the CheckHpEffect belongs to the same player who owns Kricketune
            // If effect.player is different, skip boosting.
            if (effect.player.id !== player.id) {
                return state;
            }
            // Instead of enumerating all Pokémon in the board
            // (which is not needed since it's already happening in findKoPokemons),
            // we identify which Pokemon is being checked right now
            const targetPokemonCard = effect.target.getPokemonCard();
            if (!targetPokemonCard) {
                return state;
            }
            // If that Pokemon is not Grass, skip
            // (we use checkPokemonTypeEffect instead of targetPokemonCard.cardType
            // to address additional types)
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (!checkPokemonTypeEffect.cardTypes.includes(game_1.CardType.GRASS)) {
                return state;
            }
            // Check if the ability is disabled by calling PowerEffect stub
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage -= 40;
        }
        return state;
    }
}
exports.Leavanny = Leavanny;
