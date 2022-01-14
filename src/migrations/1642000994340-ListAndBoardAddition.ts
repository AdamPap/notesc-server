import {MigrationInterface, QueryRunner} from "typeorm";

export class ListAndBoardAddition1642000994340 implements MigrationInterface {
    name = 'ListAndBoardAddition1642000994340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "list" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "boardId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_22ab0c698f915797581b2bc1a05" PRIMARY KEY ("id", "boardId"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card" ADD "listId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "PK_9451069b6f1199730791a7f4ae4"`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "PK_5a06f9f0822e0642198668eb6bf" PRIMARY KEY ("id", "listId")`);
        await queryRunner.query(`ALTER TABLE "card" ADD "listBoardId" integer`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_1a525f54aadfa6256667e688ab8" FOREIGN KEY ("listId", "listBoardId") REFERENCES "list"("id","boardId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_1a525f54aadfa6256667e688ab8"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "listBoardId"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "PK_5a06f9f0822e0642198668eb6bf"`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "listId"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "list"`);
    }

}
