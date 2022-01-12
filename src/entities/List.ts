import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { Board } from "./Board";
import { Card } from "./Card";

@Entity()
export class List extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content: string;

  @OneToMany(() => Card, (card) => card.list)
  cards?: Card[];

  @PrimaryColumn()
  boardId!: number;

  @ManyToOne(() => Board, (board) => board.lists)
  board!: Board;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;
}
