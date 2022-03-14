const {response} = require("express");

const isAdminRole = ( req, res = response, next) => {

    if ( !req.userAuth ){
        return res.status(500).json({
            msg: "Se requiere verificar el role sin validar el toke primero"
        })
    }

    const { role, name } = req.userAuth;

    if (role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${name} no es administrador - No puede hacer esto`
        });
    }

    next();
}

const hasRole = ( ...roles) => {

    return(req, res = response, next) => {
        if ( !req.userAuth ){
            return res.status(500).json({
                msg: "Se requiere verificar el role sin validar el toke primero"
            })
        }
        if ( !roles.includes( req.userAuth.role)){
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles ${ roles }`
            });
        }
        next();
    }

}
module.exports = {
    isAdminRole,
    hasRole
}
