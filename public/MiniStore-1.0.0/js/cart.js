//import {saveToStorage} from './productDetailsPage.js'
//import {products} from '../../data/products.js'
//import {deliveryOptions} from '../../data/deliveryOptions.js'
//import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'

//const today = dayjs();
//const deliveryDate = today.add(7,'days');
//console.log(deliveryDate.format('dddd, MMMM D'));

let cart = JSON.parse(localStorage.getItem('cart')) || [];
/*
export function renderOrderSummary(){
	let cartSummaryHTML = '';
	cart.forEach((matchingproduct)=>{

		cartSummaryHTML+=
				`<div class="cart-item-container js-cart-item-container-${matchingproduct.productId}">
					

					<div class="cart-item-details-grid">
						<img class="product-image"
							src="${matchingproduct.image}">

						<div class="cart-item-details">
							<div class="product-name">
							${matchingproduct.item_name}
							</div>
							<div class="product-price">
							${	matchingproduct.discount_price
								  ? `$${matchingproduct.discount_price} <small><s>$${matchingproduct.actual_price}</s></small>`
								  : `$${matchingproduct.actual_price}`
							  }
							</div>
							<div class="product-quantity">
								<span>
									Quantity: <span class="quantity-label">${matchingproduct.quantity}</span>
								</span>
								<span class="update-quantity-link link-primary">
									Update
								</span>
								<span class="delete-quantity-link link-primary 
								js-delete-link" data-product-id = ${matchingproduct.productId}>
									Delete
								</span>
							</div>
						</div>

						<div class="delivery-options">
							<div class="delivery-options-title">
								Choose a delivery option:
							</div>
							
						</div>
					</div>
				</div>`		

	});

	function deliveryOptionsHTML(matchingproduct,cartitem){
		let HTML = ``;
		deliveryOptions.forEach((option)=>{
			const today = dayjs();
			const deliveryDate = today.add(option.deliveryDays, 'days');
			const dateString = deliveryDate.format('dddd, MMMM D');
			const price = option.priceCents === 0 ?'FREE': `$${(option.priceCents/100).toFixed(2)}`
			const isChecked = option.id === cartitem.deliveryOptionID;
			HTML+=`
				<div class="delivery-option js-delivery-option"
				data-product-id = "${matchingproduct.id}"
				data-delivery-option = "${option.id}">
				<input type="radio"
					${isChecked?'checked':''}
					class="delivery-option-input"
					name="delivery-option-${matchingproduct.id}">
				<div>
					<div class="delivery-option-date">
						${dateString}
					</div>
					<div class="delivery-option-price">
						${price} - Shipping
					</div>
				</div>
			</div>`
		});
		return HTML

	}

	document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

	document.querySelectorAll(".js-delete-link").forEach((link)=>{
		link.addEventListener('click',()=>{
			const id = link.dataset.productId;
			removeFromCart(id);
			document.querySelector(`.js-cart-item-container-${id}`).remove();

		})

	});

	document.querySelectorAll(".js-delivery-option").forEach((element)=>{
		element.addEventListener('click' , ()=>{
			const productId = element.dataset.productId;
			const deliveryOptionID = element.dataset.deliveryOption;
			updateDeliveryOption(productId,deliveryOptionID);
			renderOrderSummary()
		});

	})
}*/
function renderCartPage(){
	cart = JSON.parse(localStorage.getItem('cart')) || [];
	const cartContainer = document.querySelector('.js-cart-container');

	if (cart.length === 0) {
		cartContainer.innerHTML = '<p>Your cart is empty.</p>';
		return;
	}
	let productHTML = ``;
	cart.forEach(cartitem => {
		let product = cartitem.item;
		productHTML += `
			<div class="cart-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 0.5rem; background-color: #f9f9f9;">
				<img src="${product.image}" alt="${product.item_name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
				<div style="flex: 1;">
					<h2 style="font-size: 1rem; margin: 0; font-weight: bold;">${product.item_name}</h2>
					<p style="font-size: 0.9rem; margin: 0.2rem 0;">
						${product.discount_price 
							? `$${product.discount_price} <small style="color: #888;"><s>$${product.actual_price}</s></small>` 
							: `$${product.actual_price}`}
					</p>
					<p style="font-size: 0.8rem; color: #555; margin: 0;">Quantity: ${cartitem.quantity}</p>
					<p style="font-size: 0.9rem; color: #333; margin: 0.5rem 0; font-weight: bold;">Seller: ${product.seller.store_name}</p>
				</div>
				<div style="text-align: right;">
					<div style="font-size: 0.8rem; color: #888;">Rating: ${product.item_rating ? product.item_rating.toFixed(1) : 'No rating'}</div>
					<button class="btn-delete" data-item-id = "${product.item_id}" style="background-color: #ff4d4d; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer;">Delete</button>
				</div>
			</div>
		`;
	});
	cartContainer.innerHTML = productHTML;
	document.querySelectorAll(".btn-delete").forEach((element)=>{
		element.addEventListener('click',(button)=>{
			const id = button.currentTarget.dataset.itemId;
			removeFromCart(id);
			renderCartPage();
			updateOrderSummary();
		})
	
});
}

function removeFromCart(productId){
    const newCart = [];
    cart.forEach((item)=>{
        if (item.productId !== productId)
            newCart.push(item);
    })
    cart = newCart;
    localStorage.setItem('cart',JSON.stringify(cart));
    //console.log(cart);
}


function updateOrderSummary() {
  const cartData = cart;
  const shippingCost = 4.99;  
  const taxRate = 0.1;
  
  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotal = cartData.reduce((sum, item) => sum + (item.item.discount_price || item.item.actual_price) * item.quantity, 0);
  const subtotal = itemsTotal + shippingCost;
  const tax = subtotal * taxRate;
  const orderTotal = subtotal + tax;

  document.querySelector('.js-total-items').textContent = totalItems;
  document.querySelector('.js-items-total').textContent = `$${itemsTotal.toFixed(2)}`;
  document.querySelector('.js-shipping').textContent = `$${shippingCost.toFixed(2)}`;
  document.querySelector('.js-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector('.js-tax').textContent = `$${tax.toFixed(2)}`;
  document.querySelector('.js-order-total').textContent = `$${orderTotal.toFixed(2)}`;
}

async function fetchUserBalance() {
  try {
    const userId = JSON.parse(localStorage.getItem('user_id'));
    const response = await fetch(`http://localhost:3000/user/balance?user_id=${userId}`); 
    const data = await response.json();
    console.log(data[0])
    const balanceElement = document.querySelector('.js-user-balance');
    balanceElement.textContent = `$${Number(data[0].balance).toFixed(2)}`;

     
  } catch (error) {
    console.error('Error fetching user balance:', error);
    document.querySelector('.js-user-balance').textContent = 'Error fetching balance';
  }
}


document.addEventListener('DOMContentLoaded', fetchUserBalance);

window.addEventListener('load', () => {
  renderCartPage();
});

document.addEventListener('DOMContentLoaded', () => {
  updateOrderSummary()
});

document.addEventListener('DOMContentLoaded', () => {
  const placeOrderButton = document.querySelector('.place-order-button');

  placeOrderButton.addEventListener('click', async () => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      const id = JSON.parse(localStorage.getItem('user_id'));
      //console.log(id)
      if (cartData.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      const orderDetails = cartData.map(item => ({
        item_id: item.item.item_id,
        quantity: item.quantity,
        price_at_purchase: item.item.discount_price || item.item.actual_price,
        seller_id: item.item.seller.store_name,
      }));

      const response = await fetch('http://localhost:3000/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: orderDetails,
          userId: id
        }),     
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.reload();
      } else {
        alert(`Error placing order: ${data.message}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  });
});

