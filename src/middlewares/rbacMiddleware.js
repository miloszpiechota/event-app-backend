const Permissions = require("../models/permissions");
const userTypes = require("../config/userTypes");

// Check if the user has the required permission for a route
export const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const iduser_type = req.user ? req.user.iduser_type : null;
      if (!iduser_type) {
        return res.status(401).json({ error: "Nieautoryzowany dostęp" });
      }

      const userRoleName = userTypes.get(iduser_type);
      if (!userRoleName) {
        return res.status(403).json({ error: "Nieznana rola użytkownika" });
      }

      const permissions = new Permissions();
      const userPermissions = permissions.getPermissionsByRoleAndResource(
        userRoleName,
        resource
      );

      if (userPermissions.includes(action)) {
        return next(); // Użytkownik ma uprawnienia
      } else {
        return res.status(403).json({ error: "Dostęp zabroniony" });
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania uprawnień:', error);
      return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
    }
  };
};
