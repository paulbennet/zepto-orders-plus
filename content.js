// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchSummary") {
    const aggregatedProducts = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let page = 1;

    const fetchOrders = async () => {
      try {
        while (true) {
          const response = await fetch(
            `https://api.zeptonow.com/api/v2/order/?page_number=${page}`
          );
          const data = await response.json();
          const orders = data.orders;

          // Filter orders for the current month
          const currentMonthOrders = orders.filter((order) => {
            const orderDate = new Date(order.placedTime);
            return (
              orderDate.getMonth() === currentMonth &&
              orderDate.getFullYear() === currentYear
            );
          });

          // Aggregate products
          currentMonthOrders.forEach((order) => {
            order.productsNamesAndCounts.forEach((product) => {
              if (aggregatedProducts[product.name]) {
                aggregatedProducts[product.name] += product.count;
              } else {
                aggregatedProducts[product.name] = product.count;
              }
            });
          });

          // Check if we need to fetch the next page
          if (
            orders.length === 0 ||
            orders.some(
              (order) => new Date(order.placedTime).getMonth() !== currentMonth
            )
          ) {
            break;
          }

          page++;
        }

        sendResponse({ success: true, data: aggregatedProducts });
      } catch (error) {
        console.error("Error fetching orders:", error);
        sendResponse({ success: false, error: error.message });
      }
    };

    fetchOrders();
    return true; // Keep the message channel open for async response
  }
});
