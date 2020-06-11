'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('booking', 'BookingController.index')
Route.get('booking.json', 'BookingController.index')

Route.get('schedules', 'ScheduleController.index')
Route.get('schedules.json', 'ScheduleController.index')

Route.get('/', 'ResourceController.index')
Route.get('resources', 'ResourceController.index')
Route.get('resources.json', 'ResourceController.index')
Route.post('resources', 'ResourceController.create')
Route.get('resources/:id', 'ResourceController.show').middleware('auth')
Route.put('resources/:id', 'ResourceController.update')
Route.delete('resources/:id', 'ResourceController.delete')
