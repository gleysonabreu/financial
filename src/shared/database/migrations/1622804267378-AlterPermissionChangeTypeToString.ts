import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPermissionChangeTypeToString1622804267378
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE permissions ALTER COLUMN "type" TYPE VARCHAR`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE permissions ALTER COLUMN "type" TYPE INTEGER`,
    );
  }
}
