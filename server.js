

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




let dbToUse;

if (R1Countries.includes(country)) {
  dbToUse = db1;
} else if (R2Countries.includes(country)) {
  dbToUse = db2;
} else if (R3Countries.includes(country)) {
  dbToUse = db3;
} else {
  return res.json({ message: "Country not supported for our system."});
}










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






