const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const verifyToken = require('../middleware/auth.jwt')
// const getProduct = require('../middleware/getProduct')s

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

router.patch('/:id',[getProduct,verifyToken], async (req, res) => {
    if( res.product.created_by != req.userId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.title !=null){
        res.product.title =  req.body.title
    }
    if(req.body.category !=null){
        res.product.category =  req.body.category
    }
    if(req.body.description !=null){
        res.product.description =  req.body.description
    }
    if(req.body.img !=null){
        res.product.img =  req.body.img
    }
    if(req.body.price !=null){
        res.product.price =  req.body.price
    }
    
    try{
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',[getProduct,verifyToken], async (req, res) => {
    try{
        if( res.product.created_by != req.userId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.product.remove()
        res.json({ message:'Deleted Product'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 

async function getProduct  (req, res, next){
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