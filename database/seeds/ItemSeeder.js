'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Item = use('App/Models/Item');

class ItemSeeder {
    async run () {
        await Item.query().delete();

        let a = 'A';
        for (let i=0; i<26; i++){
            let c = String.fromCharCode(i+a.charCodeAt(0));

            let item = new Item();
            item.name = c;

            await item.save();
        }


        let items = await Item.all();
        console.log(`carts = ${items.rows.length}`);

    }
}

module.exports = ItemSeeder
