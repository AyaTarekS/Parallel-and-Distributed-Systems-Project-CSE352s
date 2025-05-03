const placeOrder = async (req, res) => {
  try {
    // Fetch buyer's account ID from the database based on user_id
    const buyerAccountResult = await db.query(
      `SELECT account_id FROM account WHERE user_id = ?`,
      [req.user.id]
    );

    if (!buyerAccountResult.length) {
      console.error('Buyer account not found for user_id:', req.user.id);
      return res.status(404).json({ message: 'Buyer account not found' });
    }

    const buyerAccountId = buyerAccountResult[0].account_id;

    let totalAmount = 0;

    for (const item of req.body.order) {
      // Fetch item details from `item_freq` or `item_infreq`
      const product = await db.query(
        `SELECT * FROM item_freq WHERE item_id = ? UNION SELECT * FROM item_infreq WHERE item_id = ?`,
        [item.item_id, item.item_id]
      );
      if (!product.length) {
        console.error(`Item ${item.item_id} not found`);
        return res.status(404).json({ message: `Item ${item.item_id} not found` });
      }

      // Fetch seller account from `account` table
      const sellerAccount = await db.query(
        `SELECT * FROM account WHERE account_id = (SELECT account_id FROM seller WHERE store_name = ?)`,
        [item.seller_id]
      );
      if (!sellerAccount.length) {
        console.error(`Seller account for item ${item.item_id} not found`);
        return res.status(404).json({ message: `Seller account for item ${item.item_id} not found` });
      }

      const itemPrice = item.price_at_purchase * item.quantity;
      totalAmount += itemPrice;

      // Deduct stock quantity
      if (product[0].stock_quantity < item.quantity) {
        console.error(`Insufficient stock for item ${item.item_id}`);
        return res.status(400).json({ message: `Insufficient stock for item ${item.item_id}` });
      }
      await db.query(
        `UPDATE item_freq SET stock_quantity = stock_quantity - ? WHERE item_id = ?`,
        [item.quantity, item.item_id]
      );

      // Add amount to seller's account
      await db.query(
        `UPDATE account SET balance = balance + ? WHERE account_id = ?`,
        [itemPrice, sellerAccount[0].account_id]
      );

      // Record transaction for seller
      await db.query(
        `INSERT INTO transaction (transaction_type, transaction_date, amount, account_id) VALUES (?, ?, ?, ?)`,
        ['Credit', new Date(), itemPrice, sellerAccount[0].account_id]
      );

      // Record transfer of ownership in `transfer` table
      await db.query(
        `INSERT INTO transfer (item_id, from_account_id, to_account_id, transfer_date) VALUES (?, ?, ?, ?)`,
        [item.item_id, sellerAccount[0].account_id, buyerAccountId, new Date()]
      );
    }

    // Deduct total amount from buyer's account
    const buyerAccount = await db.query(`SELECT * FROM account WHERE account_id = ?`, [buyerAccountId]);
    if (buyerAccount[0].balance < totalAmount) {
      console.error('Insufficient balance for account_id:', buyerAccountId);
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    await db.query(
      `UPDATE account SET balance = balance - ? WHERE account_id = ?`,
      [totalAmount, buyerAccountId]
    );

    // Record transaction for buyer
    await db.query(
      `INSERT INTO transaction (transaction_type, transaction_date, amount, account_id) VALUES (?, ?, ?, ?)`,
      ['Debit', new Date(), totalAmount, buyerAccountId]
    );

    // Record order in `contains` table
    await db.query(
      `INSERT INTO contains (order_id, item_id, quantity, price_at_purchase) VALUES ?`,
      [req.body.order.map(item => [item.order_id, item.item_id, item.quantity, item.price_at_purchase])]
    );

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error in placeOrder:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { placeOrder };
