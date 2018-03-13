var Sequelize = require('sequelize')
var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var app = express()
var bodyparser = require('body-parser')
var op = Sequelize.Op

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

var sequelize = new Sequelize('barcodeAPI', null, null, {
	dialect: 'sqlite',
	storage: './barcodeAPI'
})

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection Authenticated')
	})
	.catch((err) => {
		console.error('Error: Connection not established', err)
	})

const Product = sequelize.define('Product', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.TEXT,
	upc: Sequelize.INTEGER
	// createdAt: null,
	// updatedAt: null
})

app.get('/upc', async (req, res) => {
	console.log(req.params)
	try {
		res = await Product.findOne({
			createdAt: null,
			updatedAt: null,
			where: {
				upc: {
					[op.eq]: req.params.upc
				}
			}
		})
		if (res) {
			res.send(true)
		} else {
			res.send(false)
		}
	} catch (err) {
		console.log(err)
	}
})

app.listen(8080, () => {
	console.log('Server running on port 8080')
})
