import { OrdersModelss, UsersModels } from "../models/Models"; // Import your Orders model

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

export const readOrders = async (req,res) =>{
  const Orders = await OrdersModelss.findMany({
    include:{
      order_tickets: true
    }
  })
  if(Orders.length == 0){
    return res.status(204).json({
      success: true,
      message: "Found 0 orders"
    })
  }else{
    return res.status(200).json({
      success: true,
      orders: Orders
    })
  }
};
export const readUserOrders = async (req,res) =>{
  try{
    const { iduser } = req.params; 
    const user = await UsersModels.findUnique({
      where: {
        iduser: parseInt(iduser),
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User ID not found!",
      });
    }
    const userOrders = await OrdersModelss.findMany({
      where: { iduser: parseInt(iduser) },
      
        include:{
          order_tickets: true
        }
      
    })
    if(userOrders.length == 0){
      return res.status(204).json({
        success: true,
        message: "User have no orders"
      })
    }else{
      return res.status(200).json({
        success: true,
        orders: userOrders
      })
    }
  }catch(err){
    console.log(err.message);
  }
};

export const readUserOrder = async (req,res) =>{
  try{
    const { idorder } = req.params; 
    const userOrder = await OrdersModelss.findUnique({
      where: {
        idorder: parseInt(idorder),
      },
      include:{
        order_tickets: {
          include:{
            event_ticket:{ 
              include:{
                event: {
                  include:{
                  event_location: true,
                  event_category: true
                  } 
                }
              }
           }
          }
        }  
      }
    });

    
    if(userOrder.length == 0){
      return res.status(204).json({
        success: true,
        message: "User have no orders"
      })
    }else{
      //console.log(userOrder);
      console.log(userOrder.order_tickets.map(ticket => ticket.event_ticket));

      return res.status(200).json({
        success: true,
        order: userOrder
      })
    }
  }catch(err){
    console.log(err.message);
  }
};