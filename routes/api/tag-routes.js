const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {

  try {
    const find = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tagged_product' }]
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

router.get('/:id', async (req, res) => {
  
  try {
    const find = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tagged_product' }]
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
