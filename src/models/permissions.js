
const roles = require('../config/roles.json');


class Permissions {
    constructor(){
        this.permissions = [];
    }
    getPermissionsByRoleAndResource(roleName, resource){
        const role = roles.roles.find((r) => r.name === roleName);
        return role && role.permissions[resource] ? role.permissions[resource] : [];
    }
}
module.exports = Permissions;