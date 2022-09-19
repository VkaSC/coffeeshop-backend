import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import Allergen from '../models/allergen.model';
import Utils from '../utils/core.utils';


export default class AllergenController extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            // The API REST allow to the users to select the fields to retrieve
            // with the query parameter "fields" like "fields=field1,field2,field3..."
            // If has not fields on query parameters, return all visible fields
            const fields = this.getQueryFields(req, Allergen.visibleFields());

            // Create the query with the selected fields
            let query = "SELECT " + fields.join(', ') + " FROM " + Allergen.table();

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
            query += this.createWhereClause(req, Allergen.visibleFields(), queryParameters);

            // The API Rest allow to the users to order the results as they want with the sort query option.
            // Also can select the order with the "+" or "-" operators, for example
            // sort=-<field1>,<field2>,... to sort the result by several fields and DESC order
            // sort=<field1> to sort the result by one field and ASC order
            // sort=+<field1>,<field2>,... to sort the results by several fields and ASC order
            query += this.createOrderByCaluse(req, Allergen.visibleFields());

            // The API Rest are limited an return only a set of records, maximum 200.
            // This is to use less server and connection resources and response faster
            // This limitations means that the API Rest is Paginated, that is, the users can select and start and limit query paratemers
            // to return the selected results. The start value of the next set of records are the is the start value of current page plus the returned records
            // If the returned records are less than the selected limit, means is the last page.
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Allergens retrieved successfully', result);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }
    
    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const allergen = new Allergen(req.body);
            const result = await this.query("INSERT INTO " + Allergen.table() + "SET ?", allergen);
            const id = result.insertId;
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const allergen = new Allergen(req.body);
            const result = await this.query("UPDATE " + Allergen.table() + " SET ? WHERE id = ?", [allergen, id]);
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen updated successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("DELETE FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}