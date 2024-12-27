// RBAC.js
const rolesConfig = require('../config/roles.json');

class RBAC {
    constructor() {
        this.roles = rolesConfig.roles;
        this.userTypes = this.createUserTypesMap(this.roles);
    }
    createUserTypesMap(roles) {
        return new Map(
            roles.map(role => [role.iduser_type, role.name])
        );
    }
    getRoleName(iduser_type) {
        return this.userTypes.get(iduser_type) || null;
    }
    getRole(roleName) {
        return this.roles.find(role => role.name === roleName || role.iduser_type === roleName);
    }
    hasPrivilege(roleName, privilege) {
        const role = this.getRole(roleName);
        return role ? role.privliges.includes(privilege) : false;
    }
    getPermissions(roleName, resource) {
        const role = this.getRole(roleName);
        return role && role.permissions[resource] ? role.permissions[resource] : [];
    }
    can(roleName, resource, action) {
        const permissions = this.getPermissions(roleName, resource);
        return permissions.includes(action);
    }
}

module.exports = RBAC;
