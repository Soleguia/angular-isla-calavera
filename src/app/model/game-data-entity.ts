import { CardEntity } from "./card-entity";
import { DiceEntity } from "./dice-entity";

export interface GameDataEntity {
  round: number,
  player: number,
  card: CardEntity,
  throws: ThrowEntity[]
}

export interface ThrowEntity {
    round: number,
    player: number,
    diceRoll: DiceEntity[]
}
