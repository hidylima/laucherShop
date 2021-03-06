const database = require("../../config/db");

module.exports = {
  all() {
    // pegas toda as categoria do db
    return database.query(`SELECT * FROM products ORDER BY updated_at DESC`);
  },

  create(data) {
    // query inser para bago de dado
    const query = `INSERT INTO products (
      category_id,
      user_id,
      name,
      description,
      old_price,
      price,
      quantity, 
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`;

    data.price = data.price.replace(/\D/g, ""); // formata valor para int

    const values = [
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1,
    ]; //

    return database.query(query, values);
  },

  update(data) {
    const query = `UPDATE products SET
      category_id=($1),
      name=($2),
      description=($3),
      old_price=($4),
      price=($5),
      quantity=($6),
      status=($7)
    WHERE id = $8 `;

    const values = [
      data.category_id,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1,
      data.id,
    ]; //

    return database.query(query, values);
  },

  find(id) {
    // query insert para baco de dado
    const query = `SELECT * FROM products WHERE id = $1`;

    const values = [id]; //

    return database.query(query, values);
  },

  delete(id) {
    return database.query("DELETE FROM products WHERE id = $1", [id]);
  },

  files(id) {
    return database.query("SELECT * FROM files WHERE product_id = $1", [id]);
  },

  search(params) {
    const { filter, category } = params;
    let query = "";
    let filterQuery = `WHERE`;

    if (category) {
      filterQuery = `${filterQuery}
      products.category_id = ${category}
      AND`;
    }

    filterQuery = `
    ${filterQuery}
    products.name ilike '%${filter}%'
    OR products.description ilike '%${filter}%'`;

    // let queryTotal = `(
    //   SELECT count(*) FROM roducts ${filterQuery}
    // ) AS total`;

    query = `SELECT products.*,
    categories.name AS category_name
    FROM products
    LEFT JOIN categories ON (categories.id = products.category_id)
    ${filterQuery}`;

    return database.query(query);
  },
};
