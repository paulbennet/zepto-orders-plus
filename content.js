console.log("Content script is loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in content script:", message);
  if (message.action === "fetchSummary") {
    console.log("Processing action: fetchSummary");
    const aggregatedProducts = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let page = 1;

    const fetchOrders = async () => {
      try {
        while (true) {
          console.log(`Fetching orders for page: ${page}`);
          const response = await fetch(
            `https://api.zeptonow.com/api/v2/order/?page_number=${page}`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("Fetched data:", data);
          const orders = data.orders;

          // Filter orders for the current month
          const currentMonthOrders = orders.filter((order) => {
            const orderDate = new Date(order.placedTime);
            return (
              orderDate.getMonth() === currentMonth &&
              orderDate.getFullYear() === currentYear
            );
          });
          console.log("Current month orders:", currentMonthOrders);

          // Aggregate products
          currentMonthOrders.forEach((order) => {
            order.productsNamesAndCounts.forEach((product) => {
              const imageUrl = product.image?.path
                ? `https://cdn.zeptonow.com/production/${product.image.path}`
                : "";

              if (aggregatedProducts[product.name]) {
                aggregatedProducts[product.name].count += product.count;
              } else {
                aggregatedProducts[product.name] = {
                  name: product.name,
                  count: product.count,
                  imageUrl: imageUrl, // Constructed image URL
                };
              }
            });
          });
          console.log("Aggregated products so far:", aggregatedProducts);

          // Check if we need to fetch the next page
          if (
            orders.length === 0 ||
            orders.some(
              (order) => new Date(order.placedTime).getMonth() !== currentMonth
            )
          ) {
            console.log("No more orders to fetch or outside current month.");
            break;
          }

          page++;
        }

        // Transform aggregatedProducts into an array
        const aggregatedProductsArray = Object.values(aggregatedProducts);
        console.log(
          "Final aggregated products array:",
          aggregatedProductsArray
        );
        sendResponse({ success: true, data: aggregatedProductsArray });
      } catch (error) {
        console.error("Error fetching orders:", error);
        sendResponse({ success: false, error: error.message });
      }
    };

    fetchOrders();
    return true; // Keep the message channel open for async response
  }
});
