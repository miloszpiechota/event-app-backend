// checkPermission.js
const RBAC = require('../models/RBAC');

const checkPermission = (resource, action) => {
    return (req, res, next) => {
        try {
            console.log("3");

            const iduser_type = req.user.iduser_type; // Zakładamy, że rola jest już przypisana
            
            const rbac = new RBAC();
            if (rbac.can(iduser_type, resource, action)) {
                console.log("4");

                return next(); // Użytkownik ma uprawnienie
            } else {
                return res.status(403).json({ error: "Access denied" }); // Brak dostępu
            }
        } catch (error) {
            console.error("Error checking permissions:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
};

module.exports = checkPermission;
