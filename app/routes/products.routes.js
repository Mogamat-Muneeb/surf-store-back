const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const verifyToken = require('../middleware/auth.jwt')


router.get('/', async (req, res) => {
   try {
    const products = await Product.find()
    res.json(products)
   } catch (err) {
    res.status(500).json({ message: err.message })
   }
})

router.get('/:id', getProduct , (req, res) => {
    res.json(res.product)
})

router.post('/',verifyToken, async (req, res) => {
    const product = new Product({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        img: req.body.img,
       price: req.body.price,
       created_by: req.userId
    })
    try{
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id',getProduct, async (req, res) => {
    if(req.body.title !=null){
        res.product.title =  req.body.title
    }
    if(req.body.email !=null) {
        res.product.email = req.body.email
    }
    if(req.body.description !=null){
        res.product.description =  req.body.description
    }
    if(req.body.img !=null){
        res.product.img =  req.body.img
    }
    if(req.body.cart !=null){
        res.product.cart =  req.body.cart
    }
    if(req.body.created_by !=null){
        res.product.cart =  req.body.created_by
    }
    try{
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',getProduct, async (req, res) => {
    try{
        await res.product.remove()
        res.json({ message:'Deleted Product'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 


 async function getProduct(req, res, next) {
     let product
    try{
        product = await Product.findById(req.params.id)
       if(product == null){
           return res.status(404).json({ message:'Cannot find product' })
       } 
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.product = product
    next()
}
module.exports = router