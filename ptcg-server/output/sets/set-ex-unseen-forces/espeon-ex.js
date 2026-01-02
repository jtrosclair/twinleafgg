"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeonex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espeonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.powers = [{
                name: 'Devo Flash',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Espeon ex from your hand to evolve 1 of your Pokémon, you may choose 1 Evolved Pokémon on your opponent\'s Bench, remove the highest Stage Evolution card from that Pokémon, and put it back into his or her hand.'
            }];
        this.attacks = [{
                name: 'Snap Tail',
                cost: [C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Psyloop',
                cost: [P, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 60 damage plus 30 more damage for each Trainer card your opponent has in play.'
            }];
        this.set = 'UF';
        this.setNumber = '102';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Espeon ex';
        this.fullName = 'Espeon ex UF';
    }
    reduceEffect(store, state, effect) {
        // Devo Flash
        if (prefabs_1.JUST_EVOLVED(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            const blocked = [];
            let hasAnyEvolved = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                if (opponent.active === list) {
                    return;
                }
                const hasEvolution = list.cards.some(c => c instanceof game_1.PokemonCard && c.stage !== game_1.Stage.BASIC);
                if (hasEvolution) {
                    hasAnyEvolved = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasAnyEvolved) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked }), targets => {
                        if (!targets || targets.length === 0) {
                            return state;
                        }
                        prefabs_1.ABILITY_USED(player, this);
                        const target = targets[0];
                        const evolutions = target.cards.filter(c => c instanceof game_1.PokemonCard && c.stage !== game_1.Stage.BASIC);
                        if (evolutions.length > 0) {
                            const highestStage = evolutions[evolutions.length - 1];
                            target.moveCardTo(highestStage, opponent.hand);
                        }
                        return state;
                    });
                }
            });
        }
        // Snap Tail
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            let trainerCount = 0;
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard && game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, stadiumCard)) === effect.opponent) {
                trainerCount++;
            }
            effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list) => {
                list.cards.forEach(card => {
                    if (card instanceof game_1.TrainerCard) {
                        trainerCount++;
                    }
                });
            });
            effect.damage += trainerCount * 30;
        }
        return state;
    }
}
exports.Espeonex = Espeonex;
