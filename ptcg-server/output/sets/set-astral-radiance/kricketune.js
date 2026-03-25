"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketune = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kricketune extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Kricketot';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Swelling Tune',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your [G] Pokémon in play, except any Kricketune, get +40 HP. You can\'t apply more than 1 Swelling Tune Ability at a time.'
            }
        ];
        this.attacks = [
            {
                name: 'Slash',
                cost: [G, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Kricketune';
        this.fullName = 'Kricketune ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            // Check if Kricketune is actually in play for "player"
            const isInPlay = player.active.cards.includes(this) || player.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            // If HP boost already applied, skip
            if (effect.nonstackingBoosts.includes(this.powers[0].name)) {
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
            // If that Pokemon is not Grass or is Kricketune, skip
            // (we use checkPokemonTypeEffect instead of targetPokemonCard.cardType
            // to address additional types)
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (!checkPokemonTypeEffect.cardTypes.includes(game_1.CardType.GRASS) || targetPokemonCard.name === 'Kricketune') {
                return state;
            }
            // Check if the ability is disabled by calling PowerEffect stub
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Finally, if we haven't boosted HP in this CheckHpEffect yet, add +40
            effect.hp += 40;
            effect.nonstackingBoosts.push(this.powers[0].name);
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
