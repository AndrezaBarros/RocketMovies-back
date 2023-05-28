const knex = require("../database/knex");

class MovieNotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const user_id = request.user.id;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });

        await knex("movie_tags").insert(tagsInsert);

        response.json();

    }

    async show(request, response) {
        const { title } = request.query;

        const note = await knex("movie_notes")
            .whereLike("title", `%${title}%`)
            .first();

        return response.json({
            ...note,
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let movies = await knex("movie_notes")
            .where("user_id", user_id);

        for (let i in movies) {
            let movie = movies[i];

            movie.tags = await knex("movie_tags")
                .where("note_id", movie.id);
        }

        return response.json(movies);
    }
}

module.exports = MovieNotesController;