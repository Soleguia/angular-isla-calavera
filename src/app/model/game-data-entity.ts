import { CardEntity } from "./card-entity";
import { DiceEntity } from "./dice-entity";

export interface GameDataEntity {
  round: number,
  lastPlayer: number,
  player: number,
  card: CardEntity,
  skulls:number,
  lockedDice: DiceEntity[],
  throws: ThrowEntity[]
}

export interface ThrowEntity {
    round: number,
    player: number,
    diceRoll: DiceEntity[]
}
