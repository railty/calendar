'use strict'

class ItemController {
    queryModel(){
        console.log("virtual method, should not be called");
    }
    itemName(){
        console.log("virtual method, should not be called");
    }
    async deleteAllowed(item){
        console.log("virtual method, should not be called");
        return true;
    }
    async index({view, request, response}) {
        if (request.url().match(/\.json$/)){
            let items = this.queryAll();

            let pageSize = 20;
            let page = request.qs['page'];

            let sortBy = request.qs['sort'];
            if (sortBy){
                items =  items.orderByRaw(sortBy);
            }

            //items = await items.fetch();
            items = await items.paginate(page, pageSize);

            let rc = {
                code: 'success',
                message: 'success',
                rows: items.rows,
                pages: items.pages,
            }
            response.send(JSON.stringify(rc));
        }
        else{
            return view.render(this.itemName() + '.index')
        }
    }    

    async show({auth, request, response, view}) {
        let itemId = request.params.id;
        let item = await queryOne(itemId);

        return view.render(this.itemName() + '.show', { item: item })
    }    

    async update({request, response}) {
        let itemId = request.params.id;
        let item = await this.queryOne(itemId);

        item.merge(request.body.data);

        let rc;
        try{
            await item.save()
            rc = {
                code: 'success',
                message: this.itemName() + ' updated'
            }
        }
        catch(e){
            rc = {
                code: 'warning',
                message: e.message
            }
        }

        response.send(JSON.stringify(rc));
    }    

    async create({request, response}) {
        let item = this.createOne(request.body.data);

        let rc;
        try{
            await item.save()
            rc = {
                code: 'success',
                message: this.itemName() + ' created'
            }
        }
        catch(e){
            rc = {
                code: 'warning',
                message: e.message
            }
        }

        response.send(JSON.stringify(rc));
    }    

    async delete({request, response}) {
        let itemId = request.params.id;
        const item = await this.queryOne(itemId)
        
        let code;
        let message;
        if (await this.deleteAllowed(item)){
            await item.delete()
            code = 'success';
            message = this.itemName() + " deleted"
        }else{
            code = 'warning';
            message = this.itemName() + " has entries, abort deleting"
        }

        response.send(JSON.stringify({code: code, message: message}));
    }    

}

module.exports = ItemController
