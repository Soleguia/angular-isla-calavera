import { CardEntity } from "./card-entity";
import { DiceEntity } from "./dice-entity";

export interface GameDataEntity {
  round: number,
  roundOver: boolean,
  lastPlayer: number,
  player: number,
  card: CardEntity,
  skulls:number,
  denySkull:boolean,
  skullIsland:boolean,
  lockedDice: DiceEntity[],
  savedDice: DiceEntity[],
  throws: ThrowEntity[],
  winner: number
}

export interface ThrowEntity {
    round: number,
    player: number,
    diceRoll: DiceEntity[]
}
