const url = new URL(window.location.href);

const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

async function loadTracking() {
  try {
    // Get the selected order
    const response = await fetch(
      `http://localhost:3000/orders/${orderId}`
    );

    const order = await response.json();

    // Get all products
    const productResponse = await fetch(
      'http://localhost:3000/products'
    );

    const products = await productResponse.json();

    // Find the ordered product
    const orderProduct = order.products.find((product) => {
      return product.productId === productId;
    });

    // Find product details
    const matchingProduct = products.find((product) => {
      return product.id === productId;
    });

    // Format delivery date
    const deliveryDate = new Date(
      orderProduct.estimatedDeliveryTime
    ).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    // ================================
    // Tracking Progress Calculation
    // ================================

   const orderTime = new Date(order.orderTime).getTime();
const deliveryTime = new Date(
  orderProduct.estimatedDeliveryTime
).getTime();
const currentTime = Date.now();

const totalTime = deliveryTime - orderTime;
const passedTime = currentTime - orderTime;

let progressPercent = (passedTime / totalTime) * 100;

progressPercent = Math.max(0, Math.min(progressPercent, 100));

let preparingClass = '';
let shippedClass = '';
let deliveredClass = '';

if (progressPercent <= 25) {
  preparingClass = 'current-status';
} else if (progressPercent <= 90) {
  shippedClass = 'current-status';
} else {
  deliveredClass = 'current-status';
}
    // ================================
    // Display Tracking Page
    // ================================

    document.querySelector('.js-order-tracking').innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${deliveryDate}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${orderProduct.quantity}
      </div>

      <img
        class="product-image"
        src="${matchingProduct.image}"
      >

      <div class="progress-labels-container">
        <div class="progress-label ${preparingClass}">
          Preparing
        </div>

        <div class="progress-label ${shippedClass}">
          Shipped
        </div>

        <div class="progress-label ${deliveredClass}">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div
          class="progress-bar"
          style="width: ${progressPercent}%;">
        </div>
      </div>
    `;

  } catch (error) {
    console.error(error);
  }
}

loadTracking();