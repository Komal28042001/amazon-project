async function loadOrders() {
  try {
    // Fetch orders
    const ordersResponse = await fetch('https://amazon-project-l3c1.onrender.com/orders');
    const orders = await ordersResponse.json();

    // Fetch products
    const productsResponse = await fetch('https://amazon-project-l3c1.onrender.com/products');
    const products = await productsResponse.json();

    let ordersHTML = '';

    orders.forEach((order) => {

      let productsHTML = '';

      // Support both old and new order format
      const orderItems = order.products || order.cart;

      orderItems.forEach((item) => {

        const matchingProduct = products.find((product) => {
          return product.id === item.productId;
        });

        if (!matchingProduct) {
          return;
        }

        productsHTML += `
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>

            <div class="product-delivery-date">
              Arriving on:
              ${
                item.estimatedDeliveryTime
                  ? new Date(item.estimatedDeliveryTime).toLocaleDateString()
                  : 'Not available'
              }
            </div>

            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>

            <button class="buy-again-button button-primary">
              <img
                class="buy-again-icon"
                src="images/icons/buy-again.png"
              >

              <span class="buy-again-message">
                Buy it again
              </span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      });

      ordersHTML += `
        <div class="order-container">

          <div class="order-header">

            <div class="order-header-left-section">

              <div class="order-date">
                <div class="order-header-label">
                  Order Placed:
                </div>

                <div>
                  ${new Date(order.orderTime).toLocaleDateString()}
                </div>
              </div>

              <div class="order-total">
                <div class="order-header-label">
                  Total:
                </div>

                <div>
                  ${
                    order.totalCostCents
                      ? '$' + (order.totalCostCents / 100).toFixed(2)
                      : 'Not available'
                  }
                </div>
              </div>

            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">
                Order ID:
              </div>

              <div>
                ${order.id}
              </div>
            </div>

          </div>

          <div class="order-details-grid">
            ${productsHTML}
          </div>

        </div>
      `;
    });

    document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  } catch (error) {
    console.error(error);
  }
}

loadOrders();