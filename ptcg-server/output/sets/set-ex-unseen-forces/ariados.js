"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ariados = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ariados extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spinarak';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Reactive Poison',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 30 more damage for each Special Condition affecting the Defending Pokémon.'
            },
            {
                name: 'Spider Trap',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep and Poisoned. Before applying this effect, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. If you do, the new Defending Pokémon is now Asleep and Poisoned. Your opponent chooses the Defending Pokémon to switch.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Ariados';
        this.fullName = 'Ariados UF';
        this.usedSpiderTrap = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            oppActive.specialConditions.forEach(c => {
                effect.damage += 30;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            this.usedSpiderTrap = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSpiderTrap) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const bench = opponent.bench.filter(bench => bench.cards.length > 0);
            if (bench.length === 0) {
                prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
                prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
                this.usedSpiderTrap = false;
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (!result) {
                    prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
                    prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
                    this.usedSpiderTrap = false;
                    return state;
                }
                else {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        opponent.switchPokemon(cardList);
                        prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
                        prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
                        this.usedSpiderTrap = false;
                    });
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        return state;
    }
}
exports.Ariados = Ariados;
