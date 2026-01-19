"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkAmpharos = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkAmpharos extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.cardType = L;
        this.additionalCardTypes = [D];
        this.tags = [game_1.CardTag.DARK];
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Darkest Impulse',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as Dark Ampharos is in play, whenever your opponent plays an Evolution card from his or her hand to evolve 1 of his or her Pokémon, put 2 damage counters on that Pokémon. You can\'t use more than 1 Darkest Impulse Poké-Body each turn.'
            }];
        this.attacks = [
            {
                name: 'Ram',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Shock Bolt',
                cost: [L, C, C],
                damage: 70,
                text: 'Discard all Lightning Energy attached to Dark Ampharos.'
            }
        ];
        this.set = 'TRR';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Ampharos';
        this.fullName = 'Dark Ampharos TRR';
        this.evolvesFrom = 'Dark Flaaffy';
    }
    reduceEffect(store, state, effect) {
        // Handle Darkest Impulse Poké-Body
        if (effect instanceof game_effects_1.EvolveEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            if (effect.darkestImpulseSV) {
                return state;
            }
            // Check if Dark Ampharos is in play
            let isAmpharosInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isAmpharosInPlay = true;
                }
            });
            if (!isAmpharosInPlay) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: this.powers[0].name });
            effect.target.damage += 20; // 2 damage counters = 20 damage
            effect.darkestImpulseSV = true;
        }
        // Handle Shock Bolt attack
        // if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        //   const player = effect.player;
        //   const cardList = player.active;
        //   // Discard all Lightning Energy
        //   const discardEnergyEffect = new DiscardCardsEffect(effect, );
        //   discardEnergyEffect.target = cardList;
        //   store.reduceEffect(state, discardEnergyEffect);
        // }
        return state;
    }
}
exports.DarkAmpharos = DarkAmpharos;
