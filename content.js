console.log("Content script is loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchSummary") {
    const aggregatedProducts = {};
    const selectedMonth = message.month; // Receive selected month from popup
    const currentYear = new Date().getFullYear();
    let page = 1;

    const fetchOrders = async () => {
      try {
        while (true) {
          const response = await fetch(
            `https://api.zeptonow.com/api/v2/order/?page_number=${page}`,
            { credentials: "include" }
          );
          const data = await response.json();
          const orders = data.orders;

          // Filter orders for the selected month
          const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.placedTime);
            return (
              orderDate.getMonth() === selectedMonth &&
              orderDate.getFullYear() === currentYear
            );
          });

          filteredOrders.forEach((order) => {
            order.productsNamesAndCounts.forEach((product) => {
              const imageUrl = product.image?.path
                ? `https://cdn.zeptonow.com/production/${product.image.path}`
                : "";

              if (aggregatedProducts[product.name]) {
                aggregatedProducts[product.name].count += product.count;
                aggregatedProducts[product.name].orderDates.push(
                  order.placedTime
                ); // Add order date to the list
              } else {
                aggregatedProducts[product.name] = {
                  name: product.name,
                  count: product.count,
                  imageUrl: imageUrl,
                  orderDates: [order.placedTime], // Initialize with a list containing the order date
                };
              }
            });
          });

          const previousMonth = (selectedMonth - 1 + 12) % 12;
          const hasPreviousMonthOrders = orders.some((order) => {
            const orderDate = new Date(order.placedTime);
            return (
              orderDate.getMonth() === previousMonth &&
              orderDate.getFullYear() === currentYear
            );
          });

          if (orders.length === 0 || hasPreviousMonthOrders) {
            break;
          }

          page++;
        }

        sendResponse({
          success: true,
          data: Object.values(aggregatedProducts),
        });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    };

    fetchOrders();
    return true; // Keep the message channel open for async response
  }
});
