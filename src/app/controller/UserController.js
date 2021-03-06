const { renderString } = require("nunjucks");
const { formatCpfCnpj, formatCep } = require("../../lib/utils");

const User = require("../model/User");

module.exports = {
  async registerForm(req, res) {
    return res.render("user/register");
  },

  async show(req, res) {
    const { user } = req;

    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
    user.cep = formatCep(user.cep);

    return res.render("user/index", { user });
  },

  async post(req, res) {
    const userId = await User.create(req.body);

    req.session.userId = userId;
    return res.redirect("/users");
  },

  async update(req, res) {
    try {
      const { user } = req;
      let { name, email, cpf_cnpj, cep, address } = req.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep.replace(/\D/g, "");

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address,
      });

      return res.render("user/index", {
        user,
        success: "Conta atualizada com sucesso!",
      });
    } catch (error) {
      console.log(error);
      return res.render("user/index", {
        user: req.body,
        error: "Algo deu errado",
      });
    }
  },

  async delete(req, res) {
    try {
      await User.delete(req.body.id);
      req.session.destroy();

      return res.render("session/login", {
        success: "Conta deletada com sucesso!",
      });
    } catch (err) {
      console.log(err);
      return res.render("user/index", {
        user: req.body,
        error: "Erro ao tenta deleta a conta!",
      });
    }
  },
};
