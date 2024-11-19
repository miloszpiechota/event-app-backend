const roles = require('../config/roles.json');

class Permissions {
    constructor(){
        this.permissions = roles.roles;
    }

    getPermissionsByRoleAndResource(roleName, resource){
        const role = this.permissions.find((r) => r.name === roleName);
        return role && role.permissions[resource] ? role.permissions[resource] : [];
    }
}

module.exports = Permissions;
