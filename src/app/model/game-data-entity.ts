import { CardEntity } from "./card-entity";

export interface GameDataEntity {
  round: number,
  player: number,
  card: CardEntity,
  throws: ThrowEntity[]
}

export interface ThrowEntity {
    round: number,
    player: number,
    diceRoll: number[]
}
