// RBAC.js
const rolesConfig = require('../config/roles.json');

class RBAC {
    constructor() {
        this.roles = rolesConfig.roles;
        this.userTypes = new Map([
            [1, 'user'],
            [2, 'admin'],
            [3, 'events_creator'],
            [4, 'events_ticket_validator'],
            [5, 'moderator']
        ]);
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
