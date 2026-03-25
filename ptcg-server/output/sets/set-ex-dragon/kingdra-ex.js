"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdraex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useGeneticMemory(next, store, state, self, effect) {
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
        return state;
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
class Kingdraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: G }, { type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Genetic Memory',
                cost: [W],
                damage: 0,
                text: 'Use any attack from Kingdra ex\'s Basic Pokémon card or Stage 1 Evolution card. (Kingdra ex doesn\'t have to pay for that attack\'s Energy cost.)'
            },
            {
                name: 'Hydrocannon',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Does 50 damage plus 20 more damage for each [W] Energy attached to Kingdra ex but not used to pay for this attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Kingdra ex';
        this.fullName = 'Kingdra ex DR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useGeneticMemory(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[1]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Filter for only Water Energy
            const waterEnergy = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER));
            // Get number of extra Water energy  
            const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;
            // Apply damage boost based on extra Water energy
            effect.damage += Math.min(extraWaterEnergy, 4) * 20;
        }
        return state;
    }
}
exports.Kingdraex = Kingdraex;
