"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsSneasel = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsSneasel extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [D],
                damage: 20,
                text: ''
            },
            {
                name: 'Backstab',
                cost: [D, D],
                damage: 0,
                text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon for each damage counter already on that Pokémon (Don\'t apply Weakness or Resistance for Benched Pokémon).'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '128';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Sneasel';
        this.fullName = 'Team Rocket\'s Sneasel DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const targets = opponent.bench.filter(b => b.cards.length > 0);
            if (targets.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const target = selected[0];
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, (target.damage * 2));
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.TeamRocketsSneasel = TeamRocketsSneasel;
