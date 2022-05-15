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

router.post('/', async (req, res) => {

  try {

    const createTag = await Tag.create(req.body);

    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          tagged_id: createTag.id,
          tag_id,
        };
      });
     
      await ProductTag.bulkCreate(productTagIdArr);

      res.status(200).json({ product: createTag, tags: productTagIdArr });
    } else {
      res.status(200).json({ product: createTag, tags: "None" });
    }

  } catch (err) {
    res.status(400).json(err);
  }

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value

  try {
    await Tag.update(req.body, {
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
  
    res.json({ update: "Success", tag: req.body, tags: newProductTags });
  } catch (err) {
    res.status(400).json({ update: "Failed", response: err });
  }

});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value

  try {

    await Tag.destroy({ where: { id: req.params.id } });

    res.status(200).json({ success: `Deleted tag with ID: ${req.params.id}` });
    
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
