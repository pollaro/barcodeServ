var Sequelize = require('sequelize')
var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var app = express()
var bodyparser = require('body-parser')
var op = Sequelize.Op
require('dotenv').config()

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
	try {
		var out = await Product.findOne({
			attributes: ['upc'],
			where: {
				upc: {
					[op.eq]: req.query.upc
				}
			}
		})
		if (out) {
			res.json({ found: true })
		} else {
			res.json({ found: false })
		}
	} catch (err) {
		console.log(err)
	}
})

// module.exports = app

app.listen(8080, () => {
	console.log('Server running on port 8080')
})
