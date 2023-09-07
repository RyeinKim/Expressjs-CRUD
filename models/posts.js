const mysql = require('../config/database');
const {devlog} = require("../config/config");

/**
 * 게시글쓰기
 * 유저ID로 유저이름 가져오기
 * 모든 게시글 불러오기
 * 게시글ID로 게시글 불러오기
 * 게시글 ID 로 게시글 삭제하기
 * 삭제된 게시글 불러오기
 */

// 회원가입
exports.registerUser = (reqData, callback) => {
    const sql =
        `INSERT INTO users (email, username, password, pkoneNumber)
        VALUES (${reqData.email}, ${reqData.username}, ${reqData.password}, ${reqData.phoneNumber});`
    mysql.connection.query(sql, (error, results) => {
        if (error)  {
            // 에러
            console.error(error);
            callback(error, null);
        } else {
            callback(null, results.insertId);
        }
    });
}

// 게시글쓰기
exports.writePost = (reqData, callback) => {
    const sql = `INSERT INTO posts (author_id, title, author, content)
                VALUES (${reqData.author_id}, ${reqData.title}, ${reqData.author}, ${reqData.content});`;
    mysql.connection.query(sql, (error, results) => {
        if (error)  {
            // 에러
            console.error(error);
            callback(error, null);
        } else {
            callback(null, results.insertId);
        }
    });
}

// 유저ID로 유저이름 가져오기
exports.getUserById = (user_id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    mysql.connection.query(query, user_id, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 사용자가 없을 경우 null을 반환합니다.
        }

        const user = results[0];
        return callback(null, user);
    });
}

// 모든 게시글 불러오기
exports.getPostsAll = (reqData, callback) => {
    console.log("[Model] getPostsAll in");
    const sql = `SELECT * FROM posts LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

// 게시글ID로 게시글 불러오기
exports.getPostById = (post_id, callback) => {
    const sql = 'SELECT * FROM posts WHERE post_id = ?';
    mysql.connection.query(sql, post_id, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        return callback(null, results);
    });
}

// 게시글 ID 로 게시글 삭제하기
exports.deletePostById = (post_id, callback) => {
    console.log('post delete in');
    const sql =
            `UPDATE posts SET deletedAt = ? WHERE post_id = ?;
            INSERT INTO delete_posts (post_id, author_id, author, title, content, createAt, deletedAt)
            SELECT post_id, author_id, author, title, content, createAt, deletedAt
            FROM posts
            WHERE post_id = ?;
            DELETE FROM posts
            WHERE post_id = ?;`;
    const currentDate = new Date();

    mysql.connection.query(sql, [currentDate, post_id, post_id, post_id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        console.log(`Post id ${post_id} has been deleted.`);
        return callback(null, results);
    })
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = (reqData, callback) => {
    console.log("[Model] getDeletedPosts in");
    const sql = `SELECT * FROM delete_posts LIMIT ${reqData.limit} OFFSET ${reqData.offset};`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

/*exports.deletePostById = (post_id, callback) => {
    console.log('post delete in');
    const sql = `UPDATE posts SET deletedAt = ? WHERE post_id = ?;`;
    const currentDate = new Date();

    mysql.connection.query(sql, [currentDate, post_id], (error, results) => {
        if (error) {
            // console.error(error);
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // 게시글 없을 경우 null 반환
        }

        console.log(`Post id ${post_id} has been deleted.`);
        return callback(null, results);
    })
}*/

/*
// 회원 정보 추가
exports.createUser = (email, username, password, phoneNumber, callback) => {
    const sql = `INSERT INTO users (email, username, password, phoneNumber)
                  VALUES ('${email}', '${username}', '${password}', '${phoneNumber}');`;
    mysql.connection.query(sql, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};
*/