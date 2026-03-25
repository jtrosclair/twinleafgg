"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCrossFusionStrike(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const benched = player.bench.filter(b => {
        var _a;
        return b.cards.length > 0 &&
            ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.FUSION_STRIKE));
    });
    const fusionStrike = benched.map(b => b.getPokemonCard()).filter((c) => c !== undefined);
    if (fusionStrike.length === 0) {
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, fusionStrike, { allowCancel: false }), result => {
        selected = result;
        next();
    });
    if (!selected || selected.copycatAttack) {
        return state;
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: selected.name
    });
    // Perform attack
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, selected);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class MewVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.FUSION_STRIKE];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Mew V';
        this.cardType = P;
        this.hp = 310;
        this.weakness = [{ type: D }];
        this.retreat = [];
        this.attacks = [{
                name: 'Cross Fusion Strike',
                cost: [C, C],
                copycatAttack: true,
                damage: 0,
                text: 'Choose 1 of your Benched Fusion Strike Pokémon\'s attacks and use it as this attack.'
            },
            {
                name: 'Max Miracle',
                cost: [P, P],
                damage: 130,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'E';
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.name = 'Mew VMAX';
        this.fullName = 'Mew VMAX FST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 130);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useCrossFusionStrike(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MewVMAX = MewVMAX;
