"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbolivaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Arbolivaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dolliv';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 310;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Oil Machine Gun',
                cost: [G],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon 6 times and do 20 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Aroma Shot',
                cost: [C, C, C],
                damage: 160,
                text: 'This Pokémon recovers from all Special Conditions.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arboliva ex';
        this.fullName = 'Arboliva ex DRI';
    }
    reduceEffect(store, state, effect) {
        // Oil Machine Gun
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                maxAllowedDamage.push({ target, damage: card.hp + 120 });
            });
            const damage = 120;
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 20 }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, result.damage, [target]);
                }
            });
        }
        return state;
    }
}
exports.Arbolivaex = Arbolivaex;
