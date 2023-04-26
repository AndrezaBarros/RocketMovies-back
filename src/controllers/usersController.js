const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const checkUserExists = await knex("users").select("email").where("email", String(email));

        if(checkUserExists) {
            throw new AppError("Este e-mail já está em uso");
        }

        const hashedPassword = await hash(password, 8);

        await connectionKnex.insert({
            name,
            email,
            hashedPassword
        });
    }

    async update(request, response) {
        const { name, email, password, oldPassword } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();

        const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id]);

        if(!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !oldPassword) {
            throw new AppError("A senha antiga é necessária")
        } 

        if( password && oldPassword) {
            const checkOldPassword = await compare(oldPassword, user.password);

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME("now")
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        );

        return response.json();
    }
}

module.exports = UsersController;