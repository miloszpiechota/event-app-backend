import { OrdersModelss } from "../models/Models"; // Import your Orders model

export const createOrder = async (req, res) => {
  const { total_amount, total_tax_amount, order_tickets } = req.body; // Extract order data from the request body
  const iduser = req.user.iduser; // Get user ID from the authenticated request

  try {
    // Create the order and associate tickets in a transaction
    const newOrder = await OrdersModelss.create({
      data: {
        data: new Date(), // Set the current date and time
        total_amount,
        total_tax_amount,
        iduser,
        order_tickets: {
          create: order_tickets.map(ticket => ({
            // Here, ticket should include necessary fields that match your Order_tickets model
            idticket: ticket.idticket, // Assuming your Order_tickets model has an 'idticket' field
            // Add any other relevant ticket data here, if necessary
          })),
        },
      },
    });

    return res.status(201).json({
      success: true,
      msg: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while creating the order.",
    });
  }
};
