import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class IpLogs extends BaseSchema {
  protected tableName = 'ip_logs'

  public async up () {
    this.schema
      .createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('ip');
      table.string('country');
      table.timestamp('created_at', { useTz: true });
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
