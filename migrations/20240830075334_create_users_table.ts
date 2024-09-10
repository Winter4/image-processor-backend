import type {Knex} from 'knex';
import {onUpdateTrigger} from 'database/triggers';

export async function up(knex: Knex): Promise<void> {
	const schema = knex.schema.withSchema('public');
	const tableName = 'users';

	await schema.createTable(tableName, table => {
		table
			.uuid('id')
			.primary()
			.notNullable()
			.defaultTo(knex.raw('gen_random_uuid()'));

		table
			.string('email')
			.notNullable()
			.unique();
		table
			.string('passwordHash')
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
