'use strict'
const Item = use('App/Models/Item');

class ItemController {
    async index({auth, request, response, view}) {
        if (request.url().match(/\.json$/)){
            let items = Item.query().fetch();
            let rc = {
                code: 'success',
                message: 'success',
                items: items.rows,
            }
            response.send(JSON.stringify(rc));
        }
        else{
            return view.render('item.index')
        }        
    }    
}

module.exports = ItemController
