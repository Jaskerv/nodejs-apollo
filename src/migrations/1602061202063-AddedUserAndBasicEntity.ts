import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserAndBasicEntity1602061202063 implements MigrationInterface {
    name = 'AddedUserAndBasicEntity1602061202063'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
      await queryRunner.query('ALTER TABLE "post" ADD "deletedAt" TIMESTAMP');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "post" DROP COLUMN "deletedAt"');
      await queryRunner.query('DROP TABLE "user"');
    }
}
