const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const checkUserExists = await knex("users").where("email", email);

        if(checkUserExists.length > 0) {
            throw new AppError("Este e-mail já está em uso");
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name: name,
            email: email,
            password: hashedPassword
        });
    }

    async update(request, response) {
        const { name, email, password, oldPassword } = request.body;
        const user_id = request.user.id;

        const user = await knex("users").where("id", user_id).first();

        if(!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await knex("users").where("email", email).first();

        if(userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
            throw new AppError("Este e-mail já está em uso")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email; 

        if(password && !oldPassword) {
            throw new AppError("A senha antiga é necessária")
        }

        if(password && oldPassword) {
            const checkOldPassword = await compare(oldPassword, user.password);


            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere")
            }

            console.log(user.password)
            user.password = await hash(password, 8);
        }
        
        await knex("users").where("id", user_id).first().update({
            name,
            email,
            password,
            updated_at: new Date().toIsString()
        });

        return response.json();
    }

    async show(request, response) {
        const { user_id } = request.query;

        const user = {}

        if (user_id != undefined) {
            user = await knex("users").where("id", user_id).first();
        } else {
            throw new AppError("Criador não encontrado")
        }

        return response.json(user);
    }
}

module.exports = UsersController;