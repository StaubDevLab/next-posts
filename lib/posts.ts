import pg from 'pg'
import {PostType} from "@/@types/Post";


const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDb() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users
            ( id SERIAL PRIMARY KEY,
              first_name TEXT,
              last_name TEXT,
              email TEXT)
        `)
        await client.query(`
            CREATE TABLE IF NOT EXISTS posts
            (id SERIAL PRIMARY KEY,
            image_url TEXT NOT NULL,
             title TEXT NOT NULL,
              content TEXT NOT NULL,
             created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)
        
        `)
        await client.query(`
            CREATE TABLE IF NOT EXISTS likes (
                                                 user_id INTEGER,
                                                 post_id INTEGER,
                                                 PRIMARY KEY (user_id, post_id),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
                )`)
        const {rows} = await client.query('SELECT COUNT(*) as count FROM users');
        if (parseInt(rows[0].count) === 0) {
            await client.query(`
                INSERT INTO users (first_name, last_name, email)
                VALUES ('John', 'Doe', 'john@example.com')`)
            await client.query(`
                INSERT INTO users (first_name, last_name, email)
                VALUES ('Max', 'Schwarz', 'max@example.com')
            `)
        }
    } finally {
        client.release();
    }

}

initDb();



export async function getPosts(maxNumber : number) {
    let query = `
        SELECT posts.id,
               image_url AS image,
               title,
               content,
               created_at AS createdAt,
               first_name AS userFirstName,
               last_name AS userLastName,
               COUNT(likes.post_id) AS likes,
               EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = $1) AS isLiked
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id, posts.image_url, posts.title, posts.content, posts.created_at, users.first_name, users.last_name
        ORDER BY createdAt DESC`;

    const queryParams = [2];  // Remplacez 2 par l'ID de l'utilisateur actuel si nécessaire

    if (maxNumber) {
        query += ' LIMIT $2';
        queryParams.push(maxNumber);
    }

    try {
        const { rows } = await pool.query(query, queryParams);

        // Simulation d'un délai (à supprimer en production)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return rows;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        throw error;  // Ou gérez l'erreur comme vous le souhaitez
    }
}

export async function getPost(postId : string) {
   const {rows} = await pool.query(`SELECT *
                             FROM posts
                             WHERE posts.id = $1`, [postId]);
    return rows;
}

export async function storePost(post: PostType) {
    const {rows} = await pool.query(`
    INSERT INTO posts (image_url, title, content, user_id)
        VALUES ($1, $2, $3, $4)
    `,[post.imageUrl, post.title, post.content, post.userId])

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return rows;
}

export async function deletePost(postId: string) {
    const {rows} = await pool.query(`
    DELETE FROM posts WHERE posts.id = $1`, [postId])

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return rows;
}
/*
export async function updatePostLikeStatus(postId, userId) {
    const stmt = db.prepare(`
        SELECT COUNT(*) AS count
        FROM likes
        WHERE user_id = ? AND post_id = ?`);

    const isLiked = stmt.get(userId, postId).count === 0;

    if (isLiked) {
        const stmt = db.prepare(`
            INSERT INTO likes (user_id, post_id)
            VALUES (?, ?)`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return stmt.run(userId, postId);
    } else {
        const stmt = db.prepare(`
            DELETE
            FROM likes
            WHERE user_id = ?
              AND post_id = ?`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return stmt.run(userId, postId);
    }
}
*/
