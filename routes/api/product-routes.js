const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', async (req, res) => {
  
  try {
    const find = await Product.findAll({
      include: [{
          model: Category,
        },
      ],
      include: [{ model: Tag, through: ProductTag, as: 'product_tagged' }]
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

// get one product
router.get('/:id', async (req, res) => {
  
  try {
    const find = await Product.findByPk(req.params.id, {
      include: [{
          model: Category,
        },
      ],
      include: [{ model: Tag, through: ProductTag, as: 'product_tagged' }]
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

// create new product
router.post('/', async (req, res) => {
  
  try {

    const createProduct = await Product.create(req.body);

    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: createProduct.id,
          tag_id,
        };
      });
     
      await ProductTag.bulkCreate(productTagIdArr);

      res.status(200).json({ product: createProduct, tags: productTagIdArr });
    } else {
      res.status(200).json({ product: createProduct, tags: "None" });
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {

  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
  
    const findAllMatch = await ProductTag.findAll({ where: { product_id: req.params.id } });
  
    const productTagIds = findAllMatch.map(({ tag_id }) => tag_id);
  
    const newProductTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });
  
    const productTagsToRemove = newProductTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  
    res.json({ update: "Success", product: req.body, tags: newProductTags });
  } catch (err) {
    res.status(400).json({ update: "Failed", response: err });
  }
 
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value

  try {

    await Product.destroy({ where: { id: req.params.id } });

    res.status(200).json({ success: `Deleted product with ID: ${req.params.id}` });
    
  } catch (err) {
    res.status(500).json(err);
  }
  

});

module.exports = router;
