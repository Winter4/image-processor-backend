import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
        create or replace function trigger_set_timestamp()
        returns trigger as $$
        begin
            new.updated = now() at time zone 'utc-2';
            return new;
        end;
        $$ language plpgsql; 
    `);
}

export async function down(): Promise<void> {}
