"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thievul = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_attack_prompt_1 = require("../../game/store/prompts/choose-attack-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Thievul extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nickit';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Skill Thief',
                cost: [C, C],
                damage: 0,
                text: 'If you have no cards in your hand, choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack.',
            },
            {
                name: 'Razor Fang',
                cost: [D, C, C],
                damage: 80,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '52';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Thievul';
        this.fullName = 'Thievul M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length > 0) {
                return state;
            }
            function* useSkillThief(next) {
                const opponent = game_1.StateUtils.getOpponent(state, player);
                let targetList = opponent.active;
                const hasBench = opponent.bench.some(b => b.cards.length > 0);
                if (hasBench) {
                    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            targetList = selected[0];
                        }
                        next();
                    });
                }
                const pokemonCard = targetList.getPokemonCard();
                if (!pokemonCard || pokemonCard.attacks.length === 0) {
                    return state;
                }
                let chosen;
                yield store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], { allowCancel: false }), (result) => {
                    chosen = result !== null && result !== void 0 ? result : undefined;
                    next();
                });
                if (chosen === undefined) {
                    return state;
                }
                const attackToCopy = chosen;
                store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, { name: player.name, attack: attackToCopy.name });
                const copyEffect = new game_effects_1.AttackEffect(player, opponent, attackToCopy);
                store.reduceEffect(state, copyEffect);
                if (store.hasPrompts()) {
                    yield store.waitPrompt(state, () => next());
                }
                if (copyEffect.damage > 0) {
                    const dealDamage = new attack_effects_1.DealDamageEffect(copyEffect, copyEffect.damage);
                    state = store.reduceEffect(state, dealDamage);
                }
                return state;
            }
            const generator = useSkillThief(() => generator.next());
            return generator.next().value;
        }
        return state;
    }
}
exports.Thievul = Thievul;
