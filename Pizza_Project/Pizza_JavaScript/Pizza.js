'use strict';

// Keep references to the form and receipt so the order can be read and displayed.
const pizzaForm = document.querySelector('#pizza-form');
const orderSummary = document.querySelector('#order-summary');
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

// Find the one pizza size selected from the radio-button list.
function getSelectedSize() {
  return pizzaForm.querySelector('input[name="size"]:checked');
}

// Collect every checked vegetable and meat checkbox as one list of toppings.
function getSelectedToppings() {
  return [...pizzaForm.querySelectorAll('input[name="topping"]:checked')];
}

// Calculate the customer's receipt. The first topping is free; each additional one costs $1.
function getReceipt() {
  const sizeChoice = getSelectedSize();

  // Stop if no size is selected, and let the browser explain the required choice.
  if (!sizeChoice) {
    pizzaForm.reportValidity();
    return;
  }

  const toppings = getSelectedToppings();
  const basePrice = Number(sizeChoice.dataset.price);
  const extraToppingCount = Math.max(0, toppings.length - 1);
  const extraToppingPrice = extraToppingCount;
  const total = basePrice + extraToppingPrice;

  // Fill the receipt with textContent so the customer's choices are displayed safely.
  document.querySelector('#receipt-size').textContent = `Size: ${sizeChoice.value}`;
  document.querySelector('#receipt-toppings').textContent = toppings.length
    ? `Toppings: ${toppings.map((topping) => topping.value).join(', ')}`
    : 'Toppings: none';
  document.querySelector('#receipt-base').textContent = `Pizza price: ${currency.format(basePrice)}`;
  document.querySelector('#receipt-extras').textContent = extraToppingCount
    ? `Extra toppings: ${extraToppingCount} × $1.00 = ${currency.format(extraToppingPrice)}`
    : 'Extra toppings: $0.00';
  document.querySelector('#receipt-total').textContent = `Total: ${currency.format(total)}`;
  document.querySelector('#receipt-note').textContent = toppings.length === 1
    ? 'Your one selected topping is free.'
    : toppings.length > 1
      ? 'Your first topping is free; every additional topping costs $1.'
      : 'No toppings selected.';

  // Reveal the completed receipt and move it into view for keyboard and screen-reader users.
  orderSummary.hidden = false;
  orderSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Prevent a page reload and calculate the order when Place Order is pressed.
pizzaForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getReceipt();
});

// Hide an outdated receipt whenever any menu choice changes.
pizzaForm.addEventListener('change', () => {
  orderSummary.hidden = true;
});

// Clear the receipt when the customer resets the form.
pizzaForm.addEventListener('reset', () => {
  orderSummary.hidden = true;
});
