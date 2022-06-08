"use strict";

const stripe = require("stripe")("sk_test_LMFiVJSw1HF0KoWTeXuAdejl0066HTC9dJ");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { token, products, idUser, addressShiping } = ctx.request.body;
    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.price;
    });
    const charge = await stripe.charge.create({
      amount: totalPayment * 100,
      currency: "eur",
      source: token.id,
      description: `ID Usuario: ${idUser}`,
    });
    const createOrder = [];
    for await (const product of products) {
      const data = {
        game: product.id,
        user: idUser,
        totalPayment,
        idPayment: charge.id,
        addressShiping,
      };
      const validData = await createStrapi.entityValidator.validateEntity(
        strapi.models.order,
        data
      );
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};