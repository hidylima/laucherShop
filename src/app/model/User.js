const db = require("../../config/db");
const database = require("../../config/db");
const {hash} = require('bcryptjs')

module.exports = {
  all() {
    // pegas toda as categoria do db
    return database.query(`SELECT * FROM products ORDER BY updated_at DESC`);
  },

  async create(data) {
    // query inser para bago de dado
    const query = `INSERT INTO users (
      name,
      email,
      password,
      cpf_cnpj,
      cep, 
      address
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`;

const passwordHash = await hash(data.password, 8)
    const values = [
      data.name,
      data.email,
      passwordHash,
      data.cpf_cnpj.replace(/\D/g, ""),
      data.cep.replace(/\D/g, ""),
      data.address,
    ]; //

    const results = await database.query(query, values);
    return results.rows[0].id
  },

  update(data) {
    const query = `UPDATE products SET
      category_id=($1),
      user_id=($2),
      name=($3),
      description=($4),
      old_price=($5),
      price=($6),
      quantity=($7),
      status=($8)
    WHERE id = $9 `;

    const values = [
      data.category_id,
      data.user_id || 1,
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

  async findOne(filters) {
    let query = `SELECT * FROM users `;

    Object.keys(filters).map((key) => {
      query = `${query} 
      ${key} 
      `;
      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },

  delete(id) {
    return database.query("DELETE FROM products WHERE id = $1", [id]);
  },
};
