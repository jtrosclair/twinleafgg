"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkIvysaur = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkIvysaur extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.tags = [game_1.CardTag.DARK];
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Vine Pull',
                powerType: game_2.PowerType.POKEBODY,
                text: 'Once during your turn when Dark Ivysaur retreats, choose 1 of your opponent\'s Benched Pokémon and switch it with his or her Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Fury Strikes',
                cost: [G, G],
                damage: 0,
                text: 'Your opponent puts 3 markers onto his or her Pokémon (divided as he or she chooses). (More than 1 marker can be put on the same Pokémon.) Then, this attack does 10 damage to each Pokémon for each marker on it. Don\'t apply Weakness and Resistance. Remove the markers at the end of the turn.'
            },
        ];
        this.set = 'BP';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Ivysaur';
        this.fullName = 'Dark Ivysaur BP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this) && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                if (cardList) {
                    opponent.switchPokemon(cardList);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                maxAllowedDamage.push({ target, damage: card.hp + 30 });
            });
            const damage = 30;
            return store.prompt(state, new game_1.PutDamagePrompt(effect.opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 10 }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    const putDamageEffect = new attack_effects_1.PutDamageEffect(effect, result.damage);
                    putDamageEffect.target = target;
                    effect.ignoreResistance = true;
                    effect.ignoreWeakness = true;
                    store.reduceEffect(state, putDamageEffect);
                }
            });
        }
        return state;
    }
}
exports.DarkIvysaur = DarkIvysaur;
