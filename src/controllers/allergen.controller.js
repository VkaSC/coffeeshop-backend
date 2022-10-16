const HTMLResponse = require('../output/htmlResponse.output');
const BaseController = require('../utils/base.controller');
const Allergen = require('../models/allergen.model');
const Utils = require('../utils/core.utils');
const Writer = require('../utils/fileSystem/writer');
const PathUtils = require('../utils/fileSystem/pathUtils');
const StrUtils = require('../utils/str.utils');
const config = require('../config');

const validExtensions = [
    'png',
    'jpg',
    'jpeg'
];

class AllergenController extends BaseController {

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
            const allergen = result && result.length === 1 ? new Allergen(result[0]) : undefined;
            if (!allergen) {
                return response.notFound('Not found allergen with id ' + id);
            }
            return response.success('Allergen retrieved successfully', allergen);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const allergen = new Allergen(req.body);
            const result = await this.query("INSERT INTO " + Allergen.table() + " SET ?", allergen);
            console.log(result);
            const id = result.insertId;
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            console.log(data);
            return response.success('Allergen created successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const allergen = new Allergen(req.body);
            allergen.id = id;
            const searchResult = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            const searchAllergen = searchResult && searchResult.length === 1 ? new Allergen(searchResult[0]) : undefined;
            if (!searchAllergen) {
                return response.notFound('Not found allergen with id ' + id);
            }
            const result = await this.query("UPDATE " + Allergen.table() + " SET ? WHERE id = ?", [allergen, id]);
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen updated successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async upload(req, res){
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            if (!req.files || Object.keys(req.files).length === 0) {
                return response.badRequest('Has no files to upload', HTMLResponse.TOO_LESS_DATA_STATUS);
            } else if(Object.keys(req.files).length > 1){
                return response.badRequest('Only can update one file at time', HTMLResponse.TOO_MUCH_DATA_STATUS);
            }
            let fileName = 'no_name';
            let fullPath = req.files.file.path;
            const searchResult = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            const searchAllergen = searchResult && searchResult.length === 1 ? new Allergen(searchResult[0]) : undefined;
            if (!searchAllergen) {
                Writer.delete(fullPath)
                return response.notFound('Not found allergen with id ' + id);
            } 
            const allergen = searchAllergen;
            const fileSplit = fullPath.split(PathUtils.separator);
            fileName = fileSplit[fileSplit.length - 1];
            const extSplit = fileName.split('.');
            const fileExt = extSplit[extSplit.length - 1].toLowerCase();
            if (!validExtensions.includes(fileExt)) {
                FileSystem.Writer.delete(fullPath);
                return response.badRequest('File extension not allowed. Valid extensions ' + validExtensions.join(', '), HTMLResponse.INTEGRITY_DATA_STATUS);
            }
            const protocol = req.protocol;
            const host = config.isProduction ? req.hostname : req.hostname + ':4000';
            const fileURL = `${protocol}://${host}/api/images/` + fileName;
            allergen.icon = fileURL;
            console.log(allergen.icon);
            const result = await this.query("UPDATE " + Allergen.table() + " SET ? WHERE id = ?", [allergen, id]);
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen icon uploaded successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async deleteIcon(req, res){
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            const searchAllergen = searchResult && searchResult.length === 1 ? new Allergen(searchResult[0]) : undefined;
            if (!searchAllergen) {
                Writer.delete(fullPath)
                return response.notFound('Not found allergen with id ' + id);
            }
            const allergen = searchAllergen;
            if(searchAllergen.icon){
                try {
                    Writer.delete(searchAllergen.icon);
                } catch (error) {
                    
                }
            }
            allergen.icon = undefined;
            const result = await this.query("UPDATE " + Allergen.table() + " SET ? WHERE id = ?", [allergen, id]);
            const data = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            return response.success('Allergen icon deleted successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id = ?", id);
            const searchAllergen = searchResult && searchResult.length === 1 ? new Allergen(searchResult[0]) : undefined;
            if (!searchAllergen) {
                return response.notFound('Not found allergen with id ' + id);
            }
            const result = await this.query("DELETE FROM " + Allergen.table() + " WHERE id = ?", id);
            if(searchAllergen.icon){
                try {
                    Writer.delete(searchAllergen.icon);
                } catch (error) {
                    
                }
            }
            return response.success('Allergen deleted successfully');
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

}
module.exports = AllergenController;