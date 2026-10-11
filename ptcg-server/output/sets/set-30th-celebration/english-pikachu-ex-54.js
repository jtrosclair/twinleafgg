"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishPikachuEx54 = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed text: https://api.tcgdex.net/v2/en/cards/30th-054
class EnglishPikachuEx54 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.hp = 190;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.regulationMark = 'J';
        this.set = '30C';
        this.setNumber = '54';
        this.usSetNumber = '30C 54';
        this.name = 'Pikachu ex';
        this.fullName = 'Pikachu ex 30C 54';
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Zip-Zap Frenzy', cost: [game_1.CardType.LIGHTNING], damage: 0,
                text: 'You may attach any number of Basic Energy cards from your hand to your Pokémon in any way you like.'
            }, {
                name: 'Thunder', cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS], damage: 200,
                text: 'This Pokémon also does 30 damage to itself.'
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const basic = player.hand.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC);
            if (basic.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: basic.length, allowCancel: false,
                blocked: player.hand.cards.map((c, i) => basic.includes(c) ? -1 : i).filter(i => i !== -1) }), transfers => {
                for (const transfer of transfers || []) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    store.reduceEffect(state, new play_card_effects_1.AttachEnergyEffect(player, transfer.card, target));
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const damage = new attack_effects_1.PutDamageEffect(effect, 30);
            damage.target = effect.player.active;
            store.reduceEffect(state, damage);
        }
        return state;
    }
}
exports.EnglishPikachuEx54 = EnglishPikachuEx54;
