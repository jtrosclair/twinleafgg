"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronJugulis = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IronJugulis extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [game_1.CardTag.FUTURE];
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Homing Headbutt',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to 3 of your opponent\'s Pokémon that have any damage counters on them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Baryon Beam',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 150,
                text: 'If this Pokémon has a Future Booster Energy Capsule attached, this attack can be used for [C][C][C].'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Iron Jugulis';
        this.fullName = 'Iron Jugulis PAR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damagedBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0);
            if (damagedBenchedPokemon.length === 0) {
                return state;
            }
            const blocked = [];
            opponent.bench.forEach((b, index) => {
                if (b.damage === 0) {
                    blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 3, allowCancel: false, blocked }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 50, targets);
            });
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isAncientBoosterAttached = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tools.length > 0) {
                    if (cardList.tools[0].name === 'Future Booster Energy Capsule') {
                        isAncientBoosterAttached = true;
                    }
                }
            });
            if (isAncientBoosterAttached) {
                this.attacks[1].cost = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
            }
        }
        return state;
    }
}
exports.IronJugulis = IronJugulis;
