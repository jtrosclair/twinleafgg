"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosElectrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IonosElectrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Iono\'s Voltorb';
        this.cardType = L;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Thump-Thump Boom',
                cost: [L, L],
                damage: 0,
                text: 'This Pokémon does 100 damage to itself. Flip a coin. If heads, your opponent\'s Active Pokémon is Knocked Out.'
            },
            {
                name: 'Electric Ball',
                cost: [L, L, C],
                damage: 100,
                text: ''
            },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JTG';
        this.setNumber = '48';
        this.name = 'Iono\'s Electrode';
        this.fullName = 'Iono\'s Electrode JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 100);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            return store.prompt(state, new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.FLIP_COIN), (result) => {
                if (!result) {
                    const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                }
            });
        }
        return state;
    }
}
exports.IonosElectrode = IonosElectrode;
