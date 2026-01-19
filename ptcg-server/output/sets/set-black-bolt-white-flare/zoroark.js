"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useFoulPlay(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const pokemonCard = opponent.active.getPokemonCard();
    if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], { allowCancel: false }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    if (attack === null) {
        return state;
    }
    if (attack.copycatAttack === true) {
        return state;
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
    });
    // Perform attack
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
    store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class Zoroark extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mind Jack',
                cost: [D],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Foul Play',
                cost: [C, C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark SV11W';
    }
    reduceEffect(store, state, effect) {
        // Mind Jack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            let benched = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== opponent.active) {
                    benched++;
                }
            });
            effect.damage = benched * 30;
        }
        // Foul Play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const generator = useFoulPlay(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
