//npm run dev

const express = require("express");
const mysql = require("mysql2/promise"); // Promise-based version
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use('/images', express.static(__dirname + '/images'));



const R1Countries = ['Nigeria', 'Kenya', 'Egypt', 'Ghana', 'South Africa', 'Ethiopia', 'Algeria', 'Morocco', 'Tunisia',
  'Uganda', 'Tanzania', 'Zambia', 'Zimbabwe', 'Senegal', 'Sudan', 'Libya', 'Angola', 'Somalia', 'Botswana', 'Namibia',
  'Mali', 'Niger', 'Chad', 'Burundi', 'Benin', 'Burkina Faso', 'Cameroon', 'Cote d\'Ivoire', 'Central African Republic',
  'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Rwanda', 'Gambia', 'Mozambique', 'Malawi', 'Lesotho', 'Swaziland',
  'Mauritania', 'Mauritius', 'Cape Verde', 'Djibouti', 'Comoros', 'Seychelles', 'Eritrea', 'Saudi Arabia', 'United Arab Emirates',
  'Israel', 'Iran', 'Iraq', 'Jordan', 'Kuwait', 'Oman', 'Qatar', 'Lebanon', 'Syria', 'Yemen', 'Bahrain', 'Palestinian Territory', 
  'Gabon','Madagascar','Equatorial Guinea','Congo'
  ];   
const R2Countries = ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Poland', 'Ukraine', 'Netherlands', 'Belgium',
  'Sweden', 'Norway', 'Finland', 'Denmark', 'Ireland', 'Austria', 'Switzerland', 'Portugal', 'Switzerland', 'Romania', 'Hungary',
  'Czech Republic', 'Slovakia (Slovak Republic)', 'Slovenia', 'Croatia', 'Bulgaria', 'Serbia', 'Bosnia and Herzegovina', 'Montenegro',
  'Albania', 'North Macedonia', 'Lithuania', 'Latvia', 'Estonia', 'Belarus', 'Andorra', 'Monaco', 'San Marino', 'Liechtenstein',
  'Vatican City', 'Isle of Man', 'Gibraltar', 'Jersey', 'Guernsey', 'India', 'China', 'Japan', 'Indonesia', 'Pakistan', 'Bangladesh',
  'Nepal', 'Sri Lanka', 'Afghanistan', 'Thailand', 'Luxembourg', 'Vietnam', 'Malaysia', 'Philippines', 'Myanmar', 'Kazakhstan', 'Uzbekistan',
  'Turkmenistan', 'Tajikistan', 'Kyrgyz Republic', 'Armenia', 'Georgia', 'Azerbaijan', 'Mongolia', 'Brunei Darussalam', 'Laos',
  'Cambodia', 'Bhutan', 'Greece','Iceland','Korea','Holy See (Vatican City State)'
  ];
const R3Countries = ['United States of America', 'Canada', 'Mexico', 'Greenland', 'Bermuda', 'Saint Pierre and Miquelon', 
  'United States Virgin Islands', 'Guam', 'Puerto Rico', 'Saint Barthelemy', 'Saint Martin', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Barbados', 'Antigua and Barbuda', 'Bahamas', 'Dominican Republic', 'Haiti', 'Cuba', 'Jamaica',
  'Trinidad and Tobago', 'Grenada', 'Anguilla', 'Cayman Islands', 'Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile', 'Uruguay', 
  'Paraguay', 'Ecuador', 'Venezuela', 'Bolivia', 'Guyana', 'Suriname', 'French Guiana', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea',
  'Samoa', 'Tonga', 'Vanuatu', 'Tuvalu', 'Solomon Islands', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'Palau', 'Mexico',
  'Saint Kitts and Nevis',  'French Polynesia', 'Macao', 'Hong Kong', 'Singapore', 'Taiwan', 'Cyprus',
  'Malta', 'Mauritius', 'Cook Islands', 'Saint Helena', 'Falkland Islands (Malvinas)', 'Pitcairn Islands', 'Mayotte', 'Reunion',
  'Timor-Leste', 'Guadeloupe', 'Martinique', 'Niue', 'Tokelau', 'Bouvet Island (Bouvetoya)',
  'Cuba', 'Togo', 'Sao Tome and Principe', 'French Southern Territories', 'Wallis and Futuna', 'Antarctica (the territory South of 60 deg S)',
  'Western Sahara', 'Svalbard & Jan Mayen Islands', 'Guatemala', 'Tokelau', 'Russian Federation', 'Syrian Arab Republic',
  'Libyan Arab Jamahiriya', 'Moldova', 'Niue', 'Martinique', 'Sao Tome and Principe', 'Turkey', 'Aruba', 'Northern Mariana Islands',
  'French Polynesia', 'Kiribati','Saint Helena', 'Solomon Islands', 'Mauritius', 'Guadeloupe',    'British Virgin Islands',
      'United States Minor Outlying Islands', 'Dominica', 'Nicaragua', 'Norfolk Island', 'Christmas Island', 'Turks and Caicos Islands', 'Netherlands Antilles', 'Belize', 'Montserrat','Panama', 'Maldives', 'Faroe Islands', 'New Caledonia', 'American Samoa', 'South Georgia and the South Sandwich Islands', 'Heard Island and McDonald Islands', 
      'Costa Rica', 'El Salvador', 'Honduras', 'British Indian Ocean Territory (Chagos Archipelago)' 
  ]; 


const dbConfig_central = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'MOVJGMFzfkGkMdSyjRdkmTFTbHiWwRBv',
  database: 'railway',
  port: 16791
};


const dbConfig1 = {
  host: "yamabiko.proxy.rlwy.net",
  user: "root",
  password: "KgweKTgBGTEPnCcfXeDHWWfCFUyFzgWJ",
  database: "region_1",
  port: "31329"
};




const dbConfig2 = {
  host: "nozomi.proxy.rlwy.net",
  user: "root",
  password: "oXgWHuDdAWsrYqixVirtguYVJOyCyxmT",
  database: "region_2",
  port: "35771"
};

const dbConfig3 = {
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "vQLQidlpLtmTbfEylocsdPFGSonVwtEy",
  database: "region_3",
  port: "41908"
};

let dbConfig;

async function connectDB() {
  try {
    const db2 = await mysql.createConnection(dbConfig2);
    const db1 = await mysql.createConnection(dbConfig1);
    const db3 = await mysql.createConnection(dbConfig3);



    console.log("Connected to Regions databases!");

    // Handle login
    app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const query = "SELECT * FROM user WHERE username = ? AND password = ?";

      try {
        let user = null;
        const [results1] = await db1.execute(query, [username, password]);
        if (results1.length > 0) {
          user = results1[0];
        }
    
        if (!user) {
          const [results2] = await db2.execute(query, [username, password]);
          if (results2.length > 0) {
            user = results2[0];
          }
        }
        if (!user) {
          const [results3] = await db3.execute(query, [username, password]);
          if (results3.length > 0) {
            user = results3[0];
          }
        }   
        if (user) {
          res.json({
            message: "Login successful",
            user_id: user.user_id,
          });
        } else {
          res.json({ message: "Invalid credentials" });
        }
      } catch (err) {
        console.error(err);
        res.json({ message: "Error checking credentials." });
      }
    });



    // Handle signup
    app.post("/signup", async (req, res) => {

    const { user_id, username, password, fname, lname, country } = req.body;

let dbToUse;
//let currentDB; 

if (R1Countries.includes(country)) {
  dbToUse = db1;
  //currentDB = 'db1'
} else if (R2Countries.includes(country)) {
  dbToUse = db2;
  //currentDB = 'db2'
} else if (R3Countries.includes(country)) {
  dbToUse = db3;
  //currentDB = 'db3'
} else {
  return res.json({ message: "Country not supported for our system."});
}
    //localStorage.setItem('currentDB' , JSON.stringify(currentDB));

      if (!/^\d{9}$/.test(user_id)) {
        return res.json({ message: "User ID must be a 9-digit number." });
      }

      const query = "INSERT INTO user (user_id, username, password, email_verified) VALUES (?, ?, ?, 1)";

      try {
        const [result] = await dbToUse.execute(query, [user_id, username, password]);
        res.json({ message: "Account created successfully!" });
      } catch (err) {
        console.error(err);
        res.json({ message: "Signup failed. User ID or username may already exist." });
      }
    });


  } catch (error) {
    console.error("Database connection failed:", error);
  }
}




async function connectDB2() {
  try {
    const db = await mysql.createConnection(dbConfig_central);
    console.log("Connected to Central database!");

    
    app.get('/profileInfo', async (req, res) => {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
      }
    
      try {
        const [profileRows] = await db.execute(
          `SELECT a.account_id, a.profile_picture, a.balance, a.bank_name, a.subscription_type, a.card_type,a.average_days_between_purchases ,CONCAT(p.fname,' ',p.lname) as name, p.address, p.country
           FROM account a 
           JOIN person_IdentityInfo p ON a.person_id = p.person_id
           WHERE a.person_id = ?`,
          [user_id]
        );
        
        if (profileRows.length === 0) {
          return res.status(404).json({ message: 'Account info not found for this user' });
        }
    

        const profile = profileRows[0]; 
        const account_id = profile.account_id; 

        const [itemRows] = await db.execute(
          `SELECT COUNT(*) AS item_count
           FROM have
           WHERE account_id = ?`,
          [account_id]
        );


        const [items_info] = await db.execute(
          `SELECT i.item_id, i.name, i.actual_price, i.image, h.type, i.rating
           FROM have h
           JOIN item_freq i ON h.item_id = i.item_id
           WHERE h.account_id = ?`,
          [account_id]
        );


        const [seller]=await db.execute(
          `
          SELECT s.* 
          From seller s
          JOIN account a ON s.seller_id=a.person_id
          WHERE a.account_id= ? `,
          [account_id]
        )


        const itemCount = itemRows[0].item_count || 0; 
    
        res.json({
          ...profile,
          item_count: itemCount,
          items: items_info,
          seller_info: seller[0]||[]
        }); 

        console.log(account_id,seller)

      } catch (error) {
        console.error('Error fetching profile info:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    

  } catch (error) {
    console.error("Database connection failed:", error);
  }




  app.get('/items',async(req, res)=> {
    try{
      const db = await mysql.createConnection(dbConfig_central);
    const [items]= await db.execute(
      
      `select * 
      from item_freq i
      join item_infreq q on i.item_id=q.item_id
      join category c on q.category_id=c.category_id
      `
    );

    if(items.length===0){
        return res.status(404).json({ message: 'No items to show currently' });
    }

    res.status(200).json({ items });
  }
  catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  });




  app.get('/items/search', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const { name, category, min_price, max_price, store_name, rating, sort, order, page = 1, item_id } = req.query;
      const itemsPerPage = 15;
      const offset = (page - 1) * itemsPerPage;
  
      const filters = [];
      const params = [];
  
      if (item_id) {
        filters.push("f.item_id = ?");
        params.push(item_id);
      }
      if (name) {
        filters.push("LOWER(f.name) LIKE ?");
        params.push(`%${name.toLowerCase()}%`);
      }
      if (category) {
        filters.push("LOWER(c.main_cat_name) = LOWER(?)");
        params.push(category);
      }
      if (min_price) {
        filters.push("IFNULL(i.discount_price, f.actual_price) >= ?");
        params.push(min_price);
      }
      if (max_price) {
        filters.push("IFNULL(i.discount_price, f.actual_price) <= ?");
        params.push(max_price);
      }
      if (store_name) {
        filters.push("LOWER(s.store_name) LIKE ?");
        params.push(`%${store_name.toLowerCase()}%`);
      }
      if (rating) {
        filters.push("f.rating >= ?");
        params.push(rating);
      }
  
      const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  
      let orderByClause = '';
      if (sort) {
        switch (sort) {
          case 'price_asc':
            orderByClause = 'ORDER BY IFNULL(i.discount_price, f.actual_price) ASC';
            break;
          case 'price_desc':
            orderByClause = 'ORDER BY IFNULL(i.discount_price, f.actual_price) DESC';
            break;
          case 'rating':
            orderByClause = 'ORDER BY f.rating DESC';
            break;
        }
      }
  
      const query = `
        SELECT DISTINCT
          f.item_id,
          f.name AS item_name,
          f.actual_price,
          i.discount_price,
          i.tax_rate,
          f.rating AS item_rating,
          s.store_name,
          s.rating AS seller_rating,
          c.main_cat_name AS category_name,
          f.image,
          f.stock_quantity
        FROM item_freq f
        JOIN item_infreq i ON f.item_id = i.item_id
        JOIN category c ON i.category_id = c.category_id
        JOIN seller s ON i.seller_id = s.seller_id
        JOIN have h ON f.item_id = h.item_id
        ${whereClause} AND h.type = 'to_be_sold'
        ${orderByClause}
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
  
      const countQuery = `
        SELECT COUNT(*) as total
        FROM item_freq f
        JOIN item_infreq i ON f.item_id = i.item_id
        JOIN category c ON i.category_id = c.category_id
        JOIN seller s ON i.seller_id = s.seller_id
        ${whereClause}
      `;
  
      const categoryQuery = `
        SELECT DISTINCT c.main_cat_name
        FROM category c
        JOIN item_infreq i ON c.category_id = i.category_id
        ORDER BY c.main_cat_name;
      `;
  
      const [categoryResults] = await db.query(categoryQuery);
      const [countResult] = await db.query(countQuery, params);
      const [results] = await db.query(query, params);
  
      const totalItems = countResult[0].total;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      const formatted = results.map(row => ({
        item_id:row.item_id,
        item_name: row.item_name,
        category: row.category_name,
        actual_price: parseFloat(row.actual_price),
        discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
        tax_rate: row.tax_rate ? parseFloat(row.tax_rate) : null,
        item_rating: row.item_rating ? parseFloat(row.item_rating) : null,
        image: row.image,
        stock_quantity: row.stock_quantity,
        seller: {
          store_name: row.store_name,
          rating: row.seller_rating ? parseFloat(row.seller_rating) : null
        }
      }));
  
      res.json({
        items: formatted,
        categories: categoryResults.map(cat => cat.main_cat_name),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage
        }
      });
  
      await db.end();
    } catch (err) {
      console.error("❌ Search error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/items/price-range', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const { category } = req.query;
  
      let query = `
        SELECT 
          MIN(IFNULL(i.discount_price, f.actual_price)) as min_price,
          MAX(IFNULL(i.discount_price, f.actual_price)) as max_price
        FROM item_freq f
        JOIN item_infreq i ON f.item_id = i.item_id
        JOIN category c ON i.category_id = c.category_id
      `;
  
      const params = [];
      if (category) {
        query += ` WHERE LOWER(c.main_cat_name) LIKE ?`;
        params.push(`%${category.toLowerCase()}%`);
      }
  
      const [results] = await db.query(query, params);
      res.json(results[0]);
      await db.end();
    } catch (err) {
      console.error("❌ Price range query error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/items/related', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const { category, current_id } = req.query;
  
      const query = `
        SELECT 
          f.item_id,
          f.name AS item_name,
          f.actual_price,
          i.discount_price,
          f.rating AS item_rating,
          f.image,
          c.main_cat_name AS category_name
        FROM item_freq f
        JOIN item_infreq i ON f.item_id = i.item_id
        JOIN category c ON i.category_id = c.category_id
        WHERE c.main_cat_name = ? AND f.item_id != ?
        ORDER BY RAND()
        LIMIT 4
      `;
  
      const [results] = await db.query(query, [category, current_id]);
      res.json(results);
      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/user/balance', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {user_id} = req.query;
  
      const query = `
        SELECT balance FROM railway.account
        WHERE person_id = ?
      `;
  
      const [results] = await db.query(query, [user_id]);
      res.json(results);
      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /////Transactions
  app.get('/transactions', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {user_id} = req.query;

      const buyerAccountResult = await db.query(
        `SELECT account_id FROM account WHERE person_id = ?`,
        [user_id]
      );
      //console.log(buyerAccountResult[0][0].account_id)
      const results = await db.query(
        `SELECT * FROM railway.transaction where account_id = ?`,
        [buyerAccountResult[0][0].account_id]
      );
      //console.log(results)
      res.json(results);
      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/transactions/byId', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {transactionId} = req.query;

      const transactionResult = await db.query(
        `SELECT * FROM railway.transaction where transaction_id = ?`,
        [transactionId]
      );
      //console.log(transactionResult[0][0])
      res.json(transactionResult[0][0]);

      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /////buyeraccount
  app.get('/buyerAccount', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {user_id} = req.query;

      const buyerAccountInfoResult = await db.query(
        `SELECT * FROM person_IdentityInfo WHERE person_id = ?`,
        [user_id]
      );
      //console.log(buyerAccountInfoResult[0][0])
      
      res.json(buyerAccountInfoResult[0][0]);

      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  

  /////productsDetails
  app.get('/productsDetails', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {user_id} = req.query;

      const userCountryResult = await db.query(
        `SELECT country FROM person_IdentityInfo WHERE person_id = ?`,
        [user_id]
      );
  
      if (!userCountryResult.length) {
        console.error('User not found for user_id:', req.user.id);
        return res.status(404).json({ message: 'User not found' });
      }
      let user_country = userCountryResult[0][0].country;
      //console.log(user_country)
  
      if (R1Countries.includes(user_country)) {
        dbConfig = dbConfig1;
      } else if (R2Countries.includes(user_country)) {
        dbConfig = dbConfig2;
      } else if (R3Countries.includes(user_country)) {
        dbConfig = dbConfig3;
      }
      const db2 = await mysql.createConnection(dbConfig); 


      const productsDetailsInfoResult = await db2.query(
        `SELECT * FROM orders where user_id = ?`,
        [user_id]
      );
      //console.log(productsDetailsInfoResult[0])
      
      res.json(productsDetailsInfoResult[0]);

      await db.end();
      await db2.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  ///ordercontents
  app.get('/orderContents', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const {order_id} = req.query;

      const orderContentsResult = await db.query(
        `SELECT i.name,	
		            i.image,
                c.price_at_purchase,
                c.quantity,
                s.store_name  
		     FROM railway.contains c
         join railway.item_freq i on i.item_id = c.item_id
         join railway.item_infreq f on i.item_id = f.item_id
         join railway.seller s on s.seller_id = f.seller_id
         where order_id = ?`,
        [order_id]
      );
      res.json(orderContentsResult[0]);
      
      await db.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  ///paymentInfo
  app.get('/paymentInfo', async (req, res) => {
    try {
      const db2 = await mysql.createConnection(dbConfig); 
      const {order_id} = req.query;

      const paymentInfoResult = await db2.query(
        `SELECT * FROM region_3.payment where order_id = ?`,
        [order_id]
      );
      res.json(paymentInfoResult[0]);
      
      await db2.end();
    } catch (err) {
      console.error("❌ Related products query error:", err);
      res.status(500).json({ error: err.message });
    }
  });



  


  /////
  app.post('/orders/place', async (req, res) => {
    const db = await mysql.createConnection(dbConfig_central);
    
    
    const userCountryResult = await db.query(
      `SELECT country FROM person_IdentityInfo WHERE person_id = ?`,
      [req.body.userId]
    );

    if (!userCountryResult.length) {
      console.error('User not found for user_id:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    let user_country = userCountryResult[0][0].country;
    //console.log(user_country)

    if (R1Countries.includes(user_country)) {
      dbConfig = dbConfig1;
    } else if (R2Countries.includes(user_country)) {
      dbConfig = dbConfig2;
    } else if (R3Countries.includes(user_country)) {
      dbConfig = dbConfig3;
    }

    const db2 = await mysql.createConnection(dbConfig); 
    try {
      // Fetch buyer's account ID from the database based on user_id
      const buyerAccountResult = await db.query(
        `SELECT account_id FROM account WHERE person_id = ?`,
        [req.body.userId]
      );
  
      
      if (!buyerAccountResult.length) {
        console.error('Buyer account not found for user_id:', req.user.id);
        return res.status(404).json({ message: 'Buyer account not found' });
      }

      const buyerAccountId = buyerAccountResult[0][0].account_id;
      //console.log(buyerAccountId)

      let totalAmount = 0;
      let totalTax = 0;

      let tempTotalAmount = 0;
      for (const item of req.body.order){
        const itemPrice = item.price_at_purchase * item.quantity;
        tempTotalAmount += itemPrice; 
      }

      const response = await fetch(`http://localhost:3000/user/balance?user_id=${req.body.userId}`); 
      const data = await response.json();
      let balance = data[0].balance
      if(balance < tempTotalAmount){
        console.error(`Insufficient funds`);
        return res.status(400).json({ message: `Insufficient funds` });
      }

      
      for (const item of req.body.order) {
        // Fetch item details from `item_freq` or `item_infreq`
        const product = await db.query(
          `SELECT * FROM item_freq WHERE item_id = ? `,
          [item.item_id]
        );
        if (!product.length) {
          console.error(`Item ${item.item_id} not found`);
          return res.status(404).json({ message: `Item ${item.item_id} not found` });
        }
  
        // Fetch seller account from `account` table
        const sellerAccount = await db.query(
          `SELECT * FROM railway.account WHERE account_id = (SELECT account_id FROM railway.account a
            JOIN railway.seller i ON a.person_id = i.seller_id
            WHERE store_name = ? LIMIT 1)`,
          [item.seller_id]
        );

        if ( typeof sellerAccount[0][0] === 'undefined' ){
          console.error(`Seller doesn't have an account (Don't know how actually)`);
          return res.status(400).json({ message: `Seller doesn't have an account (Don't know how actually)` });
        }
  
        const itemPrice = item.price_at_purchase * item.quantity;
        totalAmount += itemPrice;

        const itemTax = itemPrice * (item.tax_rate / 100 || 0);
        totalTax += itemTax;
        console.log(item)
  
        // Deduct stock quantity
        if (product[0].stock_quantity < item.quantity) {
          console.error(`Insufficient stock for item ${item.item_id}`);
          return res.status(400).json({ message: `Insufficient stock for item ${item.item_id}` });
        }

        const updateResult = await db.query(
          `UPDATE item_freq 
           SET stock_quantity = stock_quantity - ? 
           WHERE item_id = ? AND stock_quantity >= ?`,
          [item.quantity, item.item_id, item.quantity]
        );
  
        if (updateResult.affectedRows === 0) {
          console.error(`Failed to update stock for item ${item.item_id}. Insufficient stock.`);
          return res.status(400).json({ message: `Failed to update stock for item ${item.item_id}. Insufficient stock.` });
        }
  

        // Add amount to seller's account
        

        const sellerAccountID = sellerAccount[0][0].account_id;

        await db.query(
          `UPDATE account SET balance = balance + ? WHERE account_id = ?`,
          [itemPrice, sellerAccountID]
        );
  
        // Record transaction for seller
        let transactionId = 'TRANS' + Math.floor(Math.random() * 100000);
        await db.query(
          `INSERT INTO transaction (transaction_id, transaction_type, transaction_date, amount, account_id) VALUES (?,?, ?, ?, ?)`,
          [transactionId, 'Customer Payment recived', new Date(), itemPrice, sellerAccountID]
        );
  
        // Record transfer of ownership in `transfer` table
        await db.query(
          `INSERT INTO transfer (fromaccountid, toaccountid, Type) VALUES (?, ?, ?)`,
          [sellerAccountID, buyerAccountId, 'item']
        );
        await db.query(
          `INSERT INTO transfer (fromaccountid, toaccountid, Type) VALUES (?, ?, ?)`,
          [buyerAccountId, sellerAccountID, 'money']
        );

        ///// 'have' table handling
        const [check_seller] = await db.query(
          `SELECT * FROM have WHERE item_id = ? AND account_id = ?`,
          [item.item_id , sellerAccountID]
        );
        
        if (check_seller.length > 0) {
          await db.query(
            `UPDATE have SET type = ? WHERE item_id = ? AND account_id = ?`,
            ['sold' ,item.item_id, sellerAccountID]
          );
          //console.log("Item updated.");
        } else {
          await db.query(
            `INSERT INTO have (account_id , item_id , type) VALUES (?, ?, ?)`,
            [sellerAccountID, item.item_id, 'sold']
          );
          //console.log("Item does not exist. Insertion done for seller successfully.");
        }

        const [check_buyer] = await db.query(
          `SELECT * FROM have WHERE item_id = ? AND account_id = ?`,
          [item.item_id , buyerAccountId]
        );
        
        if (!(check_buyer.length > 0)) {
          await db.query(
            `INSERT INTO have (account_id , item_id , type) VALUES (?, ?, ?)`,
            [buyerAccountId, item.item_id, 'purchased']
          );
          //console.log("Insertion done for buyer successfully");
        }

      }

      const orderTime = new Date();
      const shippingLocation = user_country; // Assuming shipping location is the user's country
      const orderstatus = 'pending'; // Default status for a new order
      const trackingNumber = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a random tracking number
      const deliveryMethod = 'Road Freight'; // Default delivery method
      const packageType = 'box'; // Default package type
      const orderPriority = 'Medium'; // Default order priority
      const expectedDeliveryTime = new Date(orderTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from order time

      const newOrderResult = await db2.query(
        `INSERT INTO orders (user_id, total_amount, shipping_location, order_time, status, tracking_number, delivery_method, package_type, order_priority, expected_delivery_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.body.userId, totalAmount, shippingLocation, orderTime, orderstatus, trackingNumber, deliveryMethod, packageType, orderPriority, expectedDeliveryTime]
      );

      const newOrderId = newOrderResult[0].insertId;

      //// add payment
      
      const paymentMethods = ["Bank_Transfer", "Paypal", "Credit_Card", "Cash"];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentstatus = 'completed';
      
      const newPaymentResult = await db2.query(
        `INSERT INTO payment (user_id, order_id, amount_without_taxes, status, payment_date, method, tax_amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.body.userId, newOrderId, totalAmount, paymentstatus, new Date(), paymentMethod, totalTax]
      );

      const newPaymentId = newPaymentResult[0].insertId;
      
      

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
      transactionId = 'TRANS' + Math.floor(Math.random() * 100000);
      await db.query(
        `INSERT INTO transaction (transaction_id,transaction_type, transaction_date, amount, account_id) VALUES (?,?, ?, ?, ?)`,
        [transactionId,'Invoice', new Date(), totalAmount, buyerAccountId]
      );

      // Record order in `contains` table--

      await db.query(
        `INSERT INTO contains (order_id, item_id, quantity, price_at_purchase) VALUES ?`,
        [req.body.order.map(item => [newOrderId, item.item_id, item.quantity, item.price_at_purchase])]
      );
  
      res.status(200).json({ message: 'Order placed successfully' });
      await db.end();
    } catch (error) {
      console.error('Error in placeOrder:', error); // Log the error for debugging
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
      
  });
  
  
  app.get('/debug/all-tables', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const [tables] = await db.query('SHOW TABLES');
  
      const tableNames = tables.map(row => Object.values(row)[0]);
      const result = {};
  
      for (const table of tableNames) {
        try {
          const [rows] = await db.query(`SELECT * FROM \`${table}\` LIMIT 100`);
          result[table] = rows;
        } catch (err) {
          result[table] = { error: err.message };
        }
      }
  
      res.json(result);
      await db.end();
    } catch (err) {
      console.error('❌ Error getting tables:', err);
      res.status(500).json({ error: 'Failed to fetch tables' });
    }
  });
  
  app.post('/items/create', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const { 
        itemName, 
        imageUrl, 
        price, 
        discount, 
        stockQuantity,
        warranty,
        category,
        taxRate,
        sellerId 
      } = req.body;

      // Validate numeric inputs
      const actualPrice = Math.max(0, parseFloat(price));
      const validatedTaxRate = taxRate ? Math.max(0, Math.min(100, parseFloat(taxRate))) : 0;
      const validatedDiscount = discount ? Math.max(0, Math.min(100, parseFloat(discount))) : 0;
      const discountPrice = validatedDiscount > 0 ? 
        parseFloat((actualPrice * (1 - validatedDiscount/100)).toFixed(2)) : null;
      const validatedWarranty = warranty ? parseInt(warranty) : 0;

      // Get category_id using sub_cat_name
      const [categoryResult] = await db.query(
        'SELECT category_id FROM category WHERE sub_cat_name = ?',
        [category]
      );

      if (!categoryResult.length) {
        return res.status(400).json({ 
          message: 'Invalid category',
          error: 'INVALID_CATEGORY'
        });
      }

      const categoryId = categoryResult[0].category_id;

      // Insert into item_freq with transaction
      let result
      await db.beginTransaction();
      try {
         result = await db.query(
          `INSERT INTO item_freq (stock_quantity, actual_price, name, image, rating, num_ratings)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [stockQuantity, actualPrice, itemName, imageUrl, 0, 0]
        )
        console.log(result)
        const insertedItemId = result[0].insertId;

      // Insert into item_infreq with all fields explicitly specified
      await db.query(
        `INSERT INTO item_infreq (item_id, is_best_seller, tax_rate, warranty_period, link, discount_price, category_id, seller_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          insertedItemId,
          0, 
          validatedTaxRate || 0,
          validatedWarranty,
          null, 
          discountPrice,
          categoryId,
          sellerId
        ]
      );

        

        const [sellerAccount] = await db.query(
          'SELECT account_id FROM account WHERE person_id = ?',
          [sellerId]
        );

        await db.query(
          `INSERT INTO have (account_id, item_id, type)
           VALUES (?, ?, ?)`,
          [sellerAccount[0].account_id, insertedItemId, 'to_be_sold']
        );

        await db.commit();
        res.json({ 
          message: 'Listing created successfully',
          itemId: insertedItemId 
        });
      } catch (err) {
        await db.rollback();
        throw err;
      }

    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ 
        message: 'Failed to create listing',
        error: error.message 
      });
    }
  });

  // Helper function to get next available item_id
  async function getNextItemId(db) {
    const [maxIdResult] = await db.query('SELECT MAX(item_id) as maxId FROM item_freq');
    return (maxIdResult[0].maxId || 0) + 1;
  }
  
  app.get('/categories/list', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig_central);
      const [categories] = await db.query(
        'SELECT sub_cat_name FROM category ORDER BY sub_cat_name'
      );
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });
}

async function startServer() {
  try {
    await connectDB();
    await connectDB2();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();