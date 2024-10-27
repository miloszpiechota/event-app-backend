const Role = require("../models/role");
const Permissions = require("../models/permissions");
import userTypes from "../config/userTypes";

// Check if the user has the required permission for a route
export const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      //
      const iduser_type = req.user ? req.user.iduser_type : 0;
      console.log(iduser_type);
      const userRole = userTypes.get(iduser_type);
      
      // Assuming this can be asynchronous
      const userPermissions = await new Permissions().getPermissionsByRoleAndResource(
        userRole,
        resource
      );
      
      if (userPermissions.includes(action)) {
        return next(); // Proceed to the next middleware/route handler
      } else {
        console.log(userPermissions);
        return res.status(403).json({ error: "Access denied" }); // Deny access
      }
    } catch (error) {
      // Handle any errors that occur during permission check
      console.error('Error checking permissions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
