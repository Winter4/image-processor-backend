import type {Knex} from 'knex';
import {onUpdateTrigger} from 'database/triggers';

export async function up(knex: Knex): Promise<void> {
	const schema = knex.schema.withSchema('public');
	const tableName = 'images';

	await schema.createTable(tableName, table => {
		table
			.uuid('id')
			.primary()
			.notNullable()
			.defaultTo(knex.raw('gen_random_uuid()'));

		table
			.uuid('userId')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('RESTRICT');

		table
			.string('title')
			.notNullable();

		table
			.binary('data')
			.notNullable();

		table
			.string('mimeType')
			.notNullable();

		table
			.string('handleType')
			.notNullable();

		table
			.string('md5')
			.unique()
			.notNullable();

		table
			.integer('width')
			.notNullable();

		table
			.integer('height')
			.notNullable();

		table
			.timestamp('updated', {useTz: true})
			.defaultTo(knex.raw('(now() at time zone \'utc-2\')'));
		table
			.timestamp('created', {useTz: true})
			.defaultTo(knex.raw('(now() at time zone \'utc-2\')'));
	}).then(() => knex.raw(onUpdateTrigger(tableName)));
}

export async function down(): Promise<void> {}
