const { response } = require("express")
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require("../helpers/jwt")


// Registro
const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body

    try {

        // Comprobar si el email existe
        const existeEmail = await Usuario.findOne({email})
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no es válido'
            })
        }

        // Crear Instancia de usuario
        const usuario = new Usuario(req.body)

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

        // Guardar usuario en la bd
        await usuario.save()

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            msg: 'Crear usuario',
            usuario
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

// Login
const login = async (req, res = response) => {

    const {email, password} = req.body
    
    try {
        
        // Buscar el usuario en la BD
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Error en la validación.'
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Error en la validación'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

// Renew Token
const renewToken = async (req, res = response) => {

    const uid = req.uid
    const token = await generarJWT(uid)
    const usuario = Usuario.findById(uid)

    res.json({
        ok: true,
        uid: uid,
        token
    })
}



module.exports = {
    crearUsuario,
    login,
    renewToken
}