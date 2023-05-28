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
        const { id } = request.params;

        const movie = await knex("movie_notes").where({ id }).first();

        return response.json(movie);
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { title } = request.query;
        const user_id = request.user.id;

        let movies = [];

        if (title != undefined) {
            movies = await knex("movie_notes")
                .where("user_id", user_id).whereLike("title", `%${title}%`);
        } else {
            movies = await knex("movie_notes")
                .where("user_id", user_id);
        }

        for (let i in movies) {
            let movie = movies[i];

            movie.tags = await knex("movie_tags")
                .where("note_id", movie.id);
        }

        return response.json(movies);
    }
}

module.exports = MovieNotesController;