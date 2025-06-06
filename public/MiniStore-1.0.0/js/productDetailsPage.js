//export let cart = JSON.parse(localStorage.getItem('cart')) || [];
let product = {};


// Menu toggle
var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle() {
  MenuItems.style.maxHeight = MenuItems.style.maxHeight === "0px" ? "200px" : "0px";
}

// Product gallery image switching
var ProductImg = document.getElementById("ProductImg");
var SmallImg = document.getElementsByClassName("small-img");

for (let i = 0; i < SmallImg.length; i++) {
  SmallImg[i].onclick = function () {
    ProductImg.src = SmallImg[i].src;
  }
}

// Fetch and display product details
async function fetchProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    console.error('No product ID provided');
    return;
  }
  document.getElementById('loader').style.display = 'flex';
  try {
    const response = await fetch(`http://localhost:3000/items/search?item_id=${productId}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      product = data.items[0];
      displayProductDetails(product);
      fetchRelatedProducts(product.category, product.item_id); // Load related products
    } else {
      console.error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }

}

function displayProductDetails(product) {
  document.title = `${product.item_name} | Thunder Store`;
  const productImg = document.getElementById('ProductImg');
  productImg.onerror = function () {
    this.onerror = null;
    this.src = '../../images/a1.JPG';
  };
  productImg.src = product.image || '../../images/a1.JPG';

  let stockStatus = '';
  let stockColor = '';
  
  if (product.stock_quantity === 0) {
    stockStatus = 'Out of Stock!';
    stockColor = 'red';
  } else if (product.stock_quantity === 1) {
    stockStatus = 'Only 1 left in stock - order soon';
    stockColor = '#ffa500';
  } else if (product.stock_quantity === 2) {
    stockStatus = 'Only 2 left in stock - order soon';
    stockColor = '#ffa500';
  } else {
    stockStatus = 'In Stock';
    stockColor = 'green';
  }

  const detailsContainer = document.getElementById('productDetails');
  detailsContainer.innerHTML = `
    <p>Home / ${product.category}</p>
    <h1>${product.item_name}</h1>
    <h4>${
      product.discount_price
        ? `$${product.discount_price} <small><s>$${product.actual_price}</s></small>`
        : `$${product.actual_price}`
    }</h4>
    <div class="stock-status" style="color: ${stockColor}; font-weight: bold; margin: 10px 0;">
      ${stockStatus}
    </div>
    <div class="rating">
      ${getStarRating(product.item_rating)}
      <span>(${product.item_rating ? product.item_rating.toFixed(1) : 'No'} Rating)</span>
    </div>
    <input type="number" value="1" min="1" ${product.stock_quantity === 0 ? 'disabled' : ''} max="${product.stock_quantity}">
    <button class="btn" ${product.stock_quantity === 0 ? 'disabled' : ''}>Add To Cart</button>
    <h3>Product Details <i class="fa fa-indent"></i></h3>
    <br>
    <p>Seller: ${product.seller.store_name}</p>
    <p>Seller Rating: ${product.seller.rating ? product.seller.rating.toFixed(1) : 'No rating'}</p>
  `;

  // Add disabled button style if out of stock
  if (product.stock_quantity === 0) {
    document.querySelector('.btn').style.opacity = '0.5';
    document.querySelector('.btn').style.cursor = 'not-allowed';
  }
}

export function getStarRating(rating) {
  if (!rating) return '';
  const fullStars = Math.floor(rating);
  const starsHtml = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  return `<span class="stars">${starsHtml}</span>`;
}

// Fetch related products
async function fetchRelatedProducts(category, current_id) {
  try {
    const response = await fetch(`http://localhost:3000/items/related?category=${encodeURIComponent(category)}&current_id=${current_id}`);
    const data = await response.json();

    const relatedContainer = document.getElementById("related-products");
    relatedContainer.innerHTML = data.map(item => `
      <div class="col-4">
        <a href="productDetailsPage.html?id=${item.item_id}">
          <img src="${item.image}" onerror="this.onerror=null;this.src='/images/a1.JPG';" />
          <h4>${item.item_name}</h4>
          <p>$${item.discount_price || item.actual_price}</p>
        </a>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading related products:", error);
  }
  finally{
    document.getElementById('loader').style.display = 'none'; // Hide loader
  }
}

// Add to cart functionality
function addToCart(){
    let cart = JSON.parse(localStorage.getItem('cart'));
    const productId = new URLSearchParams(window.location.search).get('id');
    const quantity = Number(document.querySelector('input[type="number"]').value);
    let matchingitem;

    cart.forEach((product)=>{
      if(product.productId === productId)
          matchingitem = product;
    });
    if(matchingitem)
      matchingitem.quantity+=quantity;
    else{
      cart.push({
        productId: productId,
        quantity: quantity,
        item: product
    });
  }
  localStorage.setItem('cart',JSON.stringify(cart));
  
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Item added to cart successfully!';
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000); 
}

function disableAddToCartButton(condition, errorMessage = '') {
  const addToCartButton = document.querySelector('.btn');
  let errorElement = document.querySelector('.error-message');

  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.marginLeft = '10px';
    errorElement.style.fontSize = '0.9em';
    addToCartButton.parentNode.insertBefore(errorElement, addToCartButton.nextSibling);
  }

  if (condition) {
    addToCartButton.disabled = true;
    addToCartButton.style.opacity = '0.5';
    addToCartButton.style.cursor = 'not-allowed';
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'inline';
  } else {
    addToCartButton.disabled = false;
    addToCartButton.style.opacity = '1';
    addToCartButton.style.cursor = 'pointer';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  await fetchProductDetails();
  const userId = localStorage.getItem('user_id');
  const response = await fetch(`http://localhost:3000/selleraccount/?user_id=${userId}`);
  const seller_name = await response.json();
  disableAddToCartButton(seller_name == product.seller.store_name , "You can't buy your own items");

  document.querySelector('.btn').addEventListener('click', function (e) {
    e.preventDefault();
    addToCart();
  });
});
