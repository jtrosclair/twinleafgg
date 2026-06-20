"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cofagrigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = P;
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Six Feet Under',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack) you may Knock Out this Pokémon. If you do, put 3 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.attacks = [
            {
                name: 'Slap of Misfortune',
                cost: [P, P, C],
                damage: 70,
                text: 'NOT CURRENTLY WORKING: Whenever your opponent flips a coin during his or her next turn, treat it as tails.'
            }
        ];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const maxAllowedDamage = [];
            const damage = 30;
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    target.damage += result.damage;
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        return state;
    }
}
exports.Cofagrigus = Cofagrigus;
