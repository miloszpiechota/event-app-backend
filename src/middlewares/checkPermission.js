// checkPermission.js
const RBAC = require('../models/RBAC');

const checkPermission = (resource, action) => {
    return (req, res, next) => {
        try {
            const iduser_type = req.user.iduser_type; 
            
            const rbac = new RBAC();
            if (rbac.can(iduser_type, resource, action)) {
                return next(); 
            } else {
                return res.status(403).json({ error: "Access denied" }); 
            }
        } catch (error) {
            console.error("Error checking permissions:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
};

module.exports = checkPermission;
