const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/',  async (req, res) => {

  try {
    const find = await Category.findAll({
      include: [{
          model: Product
        },
      ],
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

router.get('/:id', async (req, res) => {
  
  try {
    const find = await Category.findByPk(req.params.id, {
      include: [{
          model: Product
        },
      ],
    });
    res.status(200).json(find);
  } catch (err) {
    res.status(400).json(err);
  }

});

router.post('/', async (req, res) => {
  
  try {
    await Category.create(req.body);
    res.status(200).json({success: "Created!", new_category: req.body.category_name});
  } catch (err) {
    res.status(400).json(err);
  }

});

router.put('/:id', async (req, res) => {

  const update = "Fancy shirts";
  try {
    await Category.update({ category_name: update }, { where: { id: req.params.id } } )
    res.status(200).json({success: `Category name changed to ${update}`});
  } catch (err) {
    res.status(400).json(err);
  }

});

router.delete('/:id', async (req, res) => {

  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
