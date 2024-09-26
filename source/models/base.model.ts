import {db} from '@ctx';
import {QueryBuilder} from 'knex';

type QueryObject = Record<string, number | string | boolean | Date | Buffer | null>
type Query = QueryBuilder | QueryObject

type GetParams<T> = {
    select: string[];
    limit: number;
    offset: number;
    sort: {
        column: keyof T;
        order: 'asc' | 'desc';
        nulls?: 'first' | 'last';
    }[]
};

abstract class Entity<Table extends QueryObject> {
    protected abstract table: string;
    protected abstract name: string;

    private readonly defaultGetParams: GetParams<Table> = {
    	select: ['*'],
    	limit: 100,
    	offset: 0,
    	sort: [{
    		column: 'created',
    		order: 'desc'
    	}]
    };

    protected async get(query: Query, format: 'single' | 'many', params: Partial<GetParams<Table>> = this.defaultGetParams) {
    	const {select, limit, offset, sort} = {...this.defaultGetParams, ...params};

    	const result = await db<Table>(this.table)
    		.where(query)
    		.select(...select)
    		.limit(limit)
    		.offset(offset)
    		.orderBy(sort);

    	return format === 'single' ? result[0] : result;
    }

    public async getOne(query: Query, params?: Partial<GetParams<Table>>) {
    	return this.get(query, 'single', params);
    }

    public async getMany(query: Query, params?: Partial<GetParams<Table>>) {
    	const values = await this.get(query, 'many', params);

    	const [result] = await db<Table>(this.table).count().where(query);
    	const count = +result['count'];

    	return {values, count};
    }

    public async create(object: Partial<Table>, select: string[] = ['*']) {
    	// @ts-expect-error don't know how to type the paran properly; seems like knex.insert() doesn't like TS generics
    	const [result] = await db<Table>(this.table).insert(object).returning(select);
    	return result;
    }
}

export default Entity;
