"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empoleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useRecall(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Gather all Pokémon cards from the evolution chain (previous evolutions)
    const evolutionCards = [];
    for (const card of player.active.cards) {
        if (card.superType === card_types_1.SuperType.POKEMON && card !== self) {
            evolutionCards.push(card);
        }
    }
    // If there are no previous evolutions with attacks, can't use this attack
    if (evolutionCards.length === 0 || !evolutionCards.some(c => c.attacks && c.attacks.length > 0)) {
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, evolutionCards, { allowCancel: false }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    if (attack === null) {
        return state; // Player chose to cancel
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
    });
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
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
class Empoleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Prinplup';
        this.cardType = W;
        this.hp = 160;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Recall',
                cost: [C],
                damage: 0,
                text: 'Choose an attack from 1 of this Pokémon\'s previous Evolutions and use it as this attack.'
            },
            {
                name: 'Aquafall',
                cost: [C, C],
                damage: 130,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Empoleon';
        this.fullName = 'Empoleon CEC';
    }
    reduceEffect(store, state, effect) {
        // Recall attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useRecall(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        // Aquafall attack - discard all energy after damage is dealt
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.Empoleon = Empoleon;
