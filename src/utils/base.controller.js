import HTMLResponse from '../output/htmlResponse.output';
import Database from '../database/database';
import StrUtils from "./str.utils";
import Utils from "../utils/core.utils";

const operators = {
    eq: '{field} = ?',
    ne: '{field} != ?',
    gt: '{field} > ?',
    gte: '{field} >= ?',
    lt: '{field} < ?',
    lte: '{field} <= ?',
    bw: '{field} >= ? AND {field} <= ?',
    bwe: '{field} > ? AND {field} < ?',
    in: '{field} IN (?)',
    //like: 'like ?',
};

export default class BaseController {

    constructor(){

    }

    // The API REST allow to the users to select the fields to retrieve
    // with the query parameter "fields" like "fields=field1,field2,field3..."
    // If has not fields on query parameters, return all visible fields
    getQueryFields(req, tableFields) {
        const fields = [];
        if (req.query.fields) {
            const splits = req.query.fields.split(',');
            for (let split of splits) {
                split = split.trim();
                if (tableFields.includes(split)) {
                    fields.push(split)
                }
            }
        } else {
            fields.push(...tableFields);
        }
        if (fields.length == 0) {
            fields.push['id'];
        }
        return fields;
    }

    getWhereCondition(operator, field) {
        operator = operator || 'eq';
        return StrUtils.replace(operators[operator], '{field}', field);
    }

    createLimitClause(req) {
        let limitClause = '';
        if(req.user && (req.user.type !== 'Admin' ||  (req.user.type === 'Admin' && (!req.query.all || req.query.all.toLowerCase() === 'false')))){
            const maxLimit = req.user.type === 'Admin' ? 1000 : 200;
            let limit = req.query.limit ? Number(req.query.limit) : 200;
            if (limit > maxLimit) {
                limit = maxLimit;
            }
            const page = req.query.page ? Number(req.query.page) : 1;
            limitClause = ' LIMIT ' + limit + ' OFFSET ' + ((page * limit) - limit);
        }
        return limitClause;
    }

    // The API Rest allow to the users to order the results as they want with the sort query option.
    // Also can select the order with the "+" or "-" operators, for example
    // sort=-<field1>,<field2>,... to sort the result by several fields and DESC order
    // sort=<field1> to sort the result by one field and ASC order
    // sort=+<field1>,<field2>,... to sort the results by several fields and ASC order
    createOrderByCaluse(req, tableFields) {
        let sortClause = '';
        if (req.query.sort) {
            const queryOrder = req.query.sort.startsWith('-') ? 'DESC' : 'ASC';
            const orderFields = [];
            const cleanedOrderBy = req.query.sort.startsWith('-') || req.query.sort.startsWith('+') ? req.query.sort.substring(1) : req.query.sort;
            const splits = cleanedOrderBy.split(',');
            for (let split of splits) {
                split = split.trim();
                if (tableFields.includes(split)) {
                    orderFields.push(split.trim())
                }
            }
            if (orderFields.length > 0) {
                sortClause += ' ORDER BY ' + orderFields.join(',') + ' ' + queryOrder;
            }
        }
        return sortClause;
    }


    // The API Rest allow to the users to make complex queries with a simple rules on query parameters
    // The users can put the objects fields on the query with a simple patter to use as where conditions
    // The sintax are the next: <fieldName>=<operator__value>, for example, name=ne__jonh
    // Available Operators
    // eq: Equals                   => <field>=eq__<value>                  (<field> = <value>) (Is the operator by default, equivalent to <field>=<value>)
    // ne: Not Equals               => <field>=ne__<value>                  (<field> != <value>)
    // gt: Greater Than             => <field>=gt__<value>                  (<field> > <value>)
    // gte: Greater Than or Equals  => <field>=gte__<value>                 (<field> >= <value>)
    // lt: Less Than                => <field>=lt__<value>                  (<field> < <value>)
    // lte: Less Than or Equals     => <field>=lte__<value>                 (<field> <= <value>)
    // bw: Between (Inclusive)      => <field>=bw__<value1>,<value2>        (<field> >= <value1> AND <field> <= <value2>)
    // bwe: Between (Exclusive)     => <field>=bwe__<value1>,<value2>       (<field> > <value1> AND <field> < <value2>)
    // in: In Set of Values         => <field>=in__<value1>,,<value2>,...   (<field> in (<value1>, <value2>, ...))
    createWhereClause(req, tableFields, parameters) {
        let queryWhere = '';
        if (Utils.hasKeys(req.query)) {
            const whereConditions = [];
            const logic = req.query.logic === 'OR' ? 'OR' : 'AND';
            for (const key of Object.keys(req.query)) {
                if (tableFields.includes(key)) {
                    const queryValue = req.query[key];
                    let operator = 'eq';
                    let value = queryValue;
                    if (queryValue.indexOf('__') !== -1) {
                        const splits = queryValue.split('__');
                        operator = splits[0];
                        value = splits[1];
                    }
                    whereConditions.push(this.getWhereCondition(operator, key));
                    if (operator === 'bw' || operator === 'bwe') {
                        const splits = value.split(',');
                        parameters.push(splits[0]);
                        parameters.push(splits[1] || splits[0]);
                    } else if (operator === 'in') {
                        const splits = value.split(',');
                        const values = [];
                        for (const split of splits) {
                            values.push(split.trim());
                        }
                        parameters.push(values);
                    } else {
                        parameters.push(value);
                    }
                }
            }
            if (whereConditions.length > 0) {
                queryWhere += ' WHERE ';
                for (let i = 0; i < whereConditions.length; i++) {
                    if (i === 0) {
                        queryWhere += whereConditions[i];
                    } else {
                        queryWhere += ' ' + logic + ' ' + whereConditions[i];
                    }
                }
            }
        }
        return queryWhere;
    }

    query(query, params) {
        return Database.getInstance().query(query, params);
    }

    async get(req, res) {
        return new HTMLResponse(req, res).notImplemented('This endpoint has not implementation');
    }

    async list(req, res) {
        return new HTMLResponse(req, res).notImplemented('This endpoint has not implementation');
    }

    async create(req, res) {
        return new HTMLResponse(req, res).notImplemented('This endpoint has not implementation');
    }

    async update(req, res) {
        return new HTMLResponse(req, res).notImplemented('This endpoint has not implementation');
    }

    async delete(req, res) {
        return new HTMLResponse(req, res).notImplemented('This endpoint has not implementation');
    }

}