'use strict'

class BookingController {
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
            return view.render('booking.index')
        }
    }    


}

module.exports = BookingController
