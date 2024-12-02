// checkPrivilege.js
const RBAC = require('../models/RBAC');

const checkPrivilege = async (req, res) => {
    
    try {
        
        const userRole = req.user.iduser_type; // Zakładamy, że rola jest już przypisana
        const privilege = req.params.privilege;
        
        const rbac = new RBAC();
        if (rbac.hasPrivilege(userRole, req.params.privilege)) {
            return res.status(200).json({ accessGranted: true }); // Użytkownik ma przywilej
        } else {
            return res.status(403).json({ error: "Access denied" }); // Brak dostępu
        }
    } catch (error) {
        console.error("Error checking privileges:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    
};

module.exports = checkPrivilege;
