const mysql = require('../config/database');

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

exports.registerUser = (reqData, callback) => {
    const sql =
        `INSERT INTO users (email, username, password, phoneNumber)
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
};