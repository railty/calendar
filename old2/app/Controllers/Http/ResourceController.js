'use strict'

const Resource = use('App/Models/Resource');

const ItemController = use('./ItemController')
class ResourceController extends ItemController {
    itemName(){
        return "resource";
    }
    queryAll(){
        return Resource.query();
    }
    queryOne(id){
        return Resource.findOrFail(id);
    }
    createOne(itemData){
        let item = new Resource();
        item.merge(itemData);        
        return item;
    }
    async deleteAllowed(item){
        let entries = await item.entries().fetch();
        return entries.rows.length == 0;
    }
}

module.exports = ResourceController
