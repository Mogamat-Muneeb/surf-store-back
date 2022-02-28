 const Product = require('../models/product')
 
 getProduct =  async (req, res, next) => {
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


module.exports = getProduct