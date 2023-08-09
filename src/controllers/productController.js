const { Product, Op } = require("../db");

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll();

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No id was provided" });
    }

    let productById = await Product.findByPk(id);

    if (!productById) {
      return res
        .status(404)
        .json({ message: `There are no products with id: ${id}` });
    }

    return res.status(200).json(productById);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "No name was provided" });
    }

    const productsByName = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: "%" + name + "%",
        },
      },
    });

    if (!productsByName) {
      return res.status(400).json({ message: `${name} was not found` });
    }

    return res.status(200).json(productsByName);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postProduct = async (req, res) => {
  console.log(req.body);
  try {
    const { name, width, height, weight, stock, price, img, duration } =
      req.body;

    if (!name || !width || !height || !weight || !stock || !price || !img) {
      return res.status(400).json({ message: "There is missing information" });
    }

    let existingProduct = await Product.findOne({
      where: {
        name: name,
      },
    });

    if (existingProduct) {
      return res.status(400).json({ message: `${name} already exists` });
    }

    await Product.create({
      name,
      width,
      height,
      weight,
      stock,
      price,
      img,
      duration,
    });

    return res
      .status(201)
      .json({ message: `${name} was successfuly created!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const putProduct = async (req, res) => {
  try {
    const {
      product_id,
      name,
      width,
      height,
      weight,
      stock,
      price,
      img,
      duration,
    } = req.body;

    if (
      !product_id ||
      !name ||
      !width ||
      !height ||
      !weight ||
      !stock ||
      !price ||
      !img
    ) {
      return res.status(400).json({ message: "There is missing information" });
    }

    const existingProduct = await Product.findByPk(product_id);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: `There are no products with id: ${product_id}` });
    }

    existingProduct.update({
      name,
      width,
      height,
      weight,
      stock,
      price,
      img,
      duration,
    });

    return res.status(200).json({ message: `${name} was updated successfuly` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No id was provided" });
    }

    const existingProduct = await Product.findByPk(id);

    if (!existingProduct) {
      return res
        .status(400)
        .json({ message: `No products with id ${id} where found` });
    }

    if (existingProduct.active === true) {
      existingProduct.update({ active: false });
      return res.status(200).json({
        message: `${existingProduct.name} has been deactivated successfuly`,
      });
    } else {
      existingProduct.update({ active: true });
      return res.status(200).json({
        message: `${existingProduct.name} has been activated successfuly`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  postProduct,
  deleteProduct,
  putProduct,
};
