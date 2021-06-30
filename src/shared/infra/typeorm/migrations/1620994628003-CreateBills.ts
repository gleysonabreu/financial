import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBills1620994628003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bills',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'account_type_id',
            type: 'uuid',
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'justification',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
        ],
        foreignKeys: [
          {
            name: 'BillsAccountType',
            columnNames: ['account_type_id'],
            referencedTableName: 'account_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bills');
  }
}
