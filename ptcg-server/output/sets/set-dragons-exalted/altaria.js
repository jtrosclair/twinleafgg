"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Altaria = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Altaria extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Swablu';
        this.cardType = N;
        this.hp = 70;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.powers = [{
                name: 'Fight Song',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your [N] Pokémon\'s attacks do 20 more damage to the Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Glide',
                cost: [W, M, C],
                damage: 40,
                text: ''
            }];
        this.set = 'DRX';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Altaria';
        this.fullName = 'Altaria DRX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            if (state.phase !== game_1.GamePhase.ATTACK)
                return state;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (owner !== player)
                return state;
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonType);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    if (!checkPokemonType.cardTypes.includes(N))
                        return state;
                    const attack = effect.attack;
                    if (attack && attack.damage > 0 && (effect.target === opponent.active || effect.target === effect.player.active))
                        effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Altaria = Altaria;
