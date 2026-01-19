"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
class Gallade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: P, value: +30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Sonic Blade',
                cost: [F, C],
                damage: 0,
                text: 'Put damage counters on the Defending Pokémon until it is 50 HP away from being Knocked Out. If you do, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Psychic Cut',
                cost: [P, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may choose as many of your face-down Prize cards as you like and put them face up. If you do, this attack does 60 damage plus 20 more damage for each Prize card you chose. (These cards remain face up for the rest of the game.)'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Gallade';
        this.fullName = 'Gallade SW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const selectedTarget = opponent.active;
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
            store.reduceEffect(state, checkHpEffect);
            const totalHp = checkHpEffect.hp;
            let damageAmount = totalHp - 50;
            // Adjust damage if the target already has damage
            const targetDamage = selectedTarget.damage;
            if (targetDamage > 0) {
                damageAmount = Math.max(0, damageAmount - targetDamage);
            }
            if (damageAmount > 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
            else if (damageAmount <= 0) {
                return state;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.isSecret);
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            if (prizes.length > 0) {
                const options = [];
                for (let i = cards.length; i >= 0; i--) {
                    options.push({ message: `Flip ${i} prize card(s)`, value: i });
                }
                store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.REVEAL_ONE_OF_YOUR_PRIZES, options.map(c => c.message), { allowCancel: false }), choice => {
                    const numCardsToFlip = options[choice].value;
                    state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: numCardsToFlip, allowCancel: true }), chosenPrize => {
                        if (chosenPrize.some(p => p.faceUpPrize == true)) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                        if (chosenPrize === null || chosenPrize.length === 0) {
                            return state;
                        }
                        chosenPrize.forEach(prizeCard => {
                            prizeCard.faceUpPrize = true;
                            prizeCard.isSecret = false;
                            prizeCard.isPublic = true;
                            effect.damage += 20;
                        });
                    });
                });
            }
        }
        return state;
    }
}
exports.Gallade = Gallade;
