import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import Product from '../models/product.model';
import Allergen from '../models/allergen.model';
import ProductAllergen from '../models/productAllergen.model';
import Utils from '../utils/core.utils';

export default class ProductControler extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, Product.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + Product.table();
            query += this.createWhereClause(req, Product.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, Product.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            if (req.query.expand && req.query.expand.toLowerCase() === "true") {
                const allergensIdsByProduct = {};
                const allergensMap = {};
                if (result && result.length > 0) {
                    const productIds = [];
                    for (const productResult of result) {
                        const product = new Product(productResult);
                        productIds.push(product.id);
                    }
                    const productAllergensResult = await this.query("SELECT " + ProductAllergen.visibleFields().join(', ') + " FROM " + ProductAllergen.table() + " WHERE productId IN (?)", [productIds]);
                    const allergenIds = [];
                    if (productAllergensResult && productAllergensResult.length > 0) {
                        for (const productAllergensResult of productAllergensResult) {
                            const productAllergen = new ProductAllergen(productAllergensResult);
                            if (!allergenIds.includes(productAllergen.allergenId)) {
                                allergenIds.push(productAllergen.allergenId);
                            }
                            if (!allergensIdsByProduct[productAllergen.productId]) {
                                allergensIdsByProduct[productAllergen.productId] = [];
                            }
                            if (!allergensIdsByProduct[productAllergen.productId].includes(productAllergen.allergenId)) {
                                allergensIdsByProduct[productAllergen.productId].push(productAllergen.allergenId);
                            }
                        }
                    }
                    if(allergenIds.length > 0){
                        const allergensResult = await this.query("SELECT " + Allergen.visibleFields().join(', ') + " FROM " + Allergen.table() + " WHERE id IN (?)", [allergenIds]);
                        if (allergensResult && allergensResult.length > 0) {
                            for (const allergenResult of allergensResult) {
                                const allergen = new Allergen(allergenResult);
                                allergensMap[allergen.id] = allergen;
                            }
                        }
                    }
                    for (const productResult of result) {
                        const allergens = [];
                        if (allergensIdsByProduct[productResult.id] && allergensIdsByProduct[productResult.id].length > 0) {
                            for (const allergenId of allergensIdsByProduct[productResult.id]) {
                                const allergen = allergensMap[allergenId];
                                if (allergen) {
                                    allergens.push(allergen);
                                }
                            }
                        }
                        productResult.allergens = allergens;
                    }
                }
            }
            return response.success('Products Retrieved successfully', result);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", id);
            const product = result && result.length === 1 ? new Product(result[0]) : undefined;
            if (!product) {
                return response.notFound('Not found product with id ' + id);
            }
            return response.success('Product Retrieved successfully', product);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const product = new Product(req.body)

            if (product.name == undefined || product.type == undefined || product.category == undefined || product.price == undefined) {
                return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp', HTMLResponse.MISSING_DATA_STATUS);
            }
            const result = await this.query("INSERT " + Product.table() + " SET ?", product.toSQL());
            const id = result.insertId;
            if (product.allergens && product.allergens.length > 0) {
                for (const allergen of product.allergens) {
                    const allergenRel = new ProductAllergen();
                    allergenRel.allergenId = allergen.id;
                    allergenRel.productId = id;
                    await this.query("INSERT " + ProductAllergen.table() + " SET ?", allergenRel);
                }
            }
            const data = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", id);
            return response.success('Product Created successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const product = new Product(req.body);
            const searchResult = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", [id]);
            const searchProduct = searchResult && searchResult.length === 1 ? new Product(searchResult[0]) : undefined;
            if (!searchProduct) {
                return response.notFound('Not found product with id ' + id);
            }
            if (product.id == undefined || product.name == undefined || product.type == undefined || product.category == undefined || product.price == undefined) {
                return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp', HTMLResponse.MISSING_DATA_STATUS);
            }

            const result = await this.query("UPDATE " + Product.table() + " SET ? WHERE id = ?", [product.toSQL(), id]);
            const productAllergens = await this.query("SELECT " + ProductAllergen.visibleFields().join(',') + " FROM " + ProductAllergen.table() + " WHERE productId = ?", [id]);
            const existingIds = [];
            for(const allergen of productAllergens){
                existingIds.push(allergen.id);
            }
            console.log(product);
            if (product.allergens && product.allergens.length > 0) {
                for(const existingId of existingIds){
                    const filter = product.allergens.filter((element) => {
                        return element.id === existingId;
                    });
                    if(!filter || filter.length === 0){
                        await this.query("DELETE FROM " + ProductAllergen.table() + " WHERE id = ?", existingId);
                    }
                }
                for (const allergen of product.allergens) {
                    if(!existingIds.includes(allergen.id)){
                        const allergenRel = new ProductAllergen();
                        allergenRel.allergenId = allergen.id;
                        allergenRel.productId = id;
                        await this.query("INSERT " + ProductAllergen.table() + " SET ?", allergenRel);
                    }
                }
            } else {
                if(existingIds.length > 0){
                    for(const existingId of existingIds){
                        await this.query("DELETE FROM " + ProductAllergen.table() + " WHERE id = ?", existingId);
                    }
                }
            }
            const data = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", id);
            return response.success('Product Updated successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", [id]);
            const searchProduct = searchResult && searchResult.length === 1 ? new Product(searchResult[0]) : undefined;
            if (!searchProduct) {
                return response.notFound('Not found product with id ' + id);
            }
            const result = await this.query("DELETE FROM " + Product.table() + " WHERE id = ?", id);
            return response.success('Product Deleted successfully');
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

}
