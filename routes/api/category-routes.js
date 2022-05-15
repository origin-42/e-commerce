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
    res.status(200).json({success: "Created!", data: req.body});
  } catch (err) {
    res.status(400).json(err);
  }

});

router.put('/:id', async (req, res) => {

  try {
    await Category.update({ category_name: req.body.category_name }, { where: { id: req.params.id } } )
    res.status(200).json({success: `Category name changed to ${req.body.category_name}`});
  } catch (err) {
    res.status(400).json(err);
  }

});

router.delete('/:id', async (req, res) => {

  try {

    await Category.destroy({ where: { id: req.params.id } });

    res.status(200).json({ success: `Deleted category with ID: ${req.params.id}` });
    
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
