const db = require("../config/db_config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const userController = {
    getAllUsers: (req, res) => {
        const sql = "SELECT * FROM `user` WHERE status_active = true";
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error in getAllUsers:", err);
                return res.status(500).json({
                    message: "Failed to fetch users.",
                    error: err.message,
                });
            }
            return res.status(200).json(result);
        });
    },

    updateUser: async (req, res) => {
        const {
            id,
            email,
            password,
            first_name,
            last_name,
            create_date,
            create_by,
            update_by,
        } = req.body;
    
        if (!id || !email || !password || !first_name || !last_name || !create_date || !create_by || !update_by) {
            return res.status(400).json({
                message: "Missing required fields.",
            });
        }
    
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const updateSQL = `UPDATE user SET status_active = false WHERE id = ?`;
    
            const insertSQL = `
                INSERT INTO user
                (email, password, first_name, last_name, create_date, create_by, update_date, update_by, status_active)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, TRUE)
            `;
    
            db.query(updateSQL, [id], (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).json({
                        message: "Database error during user deactivation.",
                        error: err.message,
                    });
                }
    
                const values = [
                    email,
                    hashedPassword,
                    first_name,
                    last_name,
                    create_date,
                    create_by,
                    update_by,
                ];
    
                db.query(insertSQL, values, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error("Error inserting new user version:", insertErr);
                        return res.status(500).json({
                            message: "Database error during inserting new user.",
                            error: insertErr.message,
                        });
                    }
    
                    return res.status(200).json({
                        message: "User updated successfully.",
                        updatedOldUser: result,
                        insertedNewUser: insertResult,
                    });
                });
            });
        } catch (err) {
            console.error("Error hashing password during update:", err);
            return res.status(500).json({
                message: "Error processing password for update.",
                error: err.message,
            });
        }
    },
    

    getLogin: (req, res) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }
    
        const sql = `SELECT * FROM user WHERE email = ? AND status_active = true`;
    
        db.query(sql, [email], async (err, result) => {
            if (err) {
                console.error("Login query error:", err);
                return res.status(500).json({
                    message: "Database error during login.",
                    error: err.message,
                });
            }
    
            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or inactive account.",
                });
            }
    
            const user = result[0];
    
            try {
                const isMatch = await bcrypt.compare(password, user.password);
    
                if (!isMatch) {
                    return res.status(401).json({
                        message: "Incorrect password.",
                    });
                }
    
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                    },
                    SECRET_KEY,
                    {
                        expiresIn: "1d",
                    }
                );
    
                return res.status(200).json({
                    message: "Login successful.",
                    token,
                    id : user.id
                });
            } catch (bcryptError) {
                console.error("Password compare error:", bcryptError);
                return res.status(500).json({
                    message: "Error verifying password.",
                    error: bcryptError.message,
                });
            }
        });
    },

    createUser: async (req, res) => {
        const { email, password, firstName, lastName } = req.body;
    
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required." });
        }
    
        try {
            // ตรวจสอบว่า email มีอยู่ในระบบหรือยัง
            const checkEmailSQL = `SELECT * FROM user WHERE email = ? LIMIT 1`;
            db.query(checkEmailSQL, [email], async (checkErr, checkResults) => {
                if (checkErr) {
                    console.error("Error checking email:", checkErr);
                    return res.status(500).json({ message: "Database error while checking email" });
                }
    
                if (checkResults.length > 0) {
                    return res.status(401).json({ message: "Email already exists" });
                }
    
                // เข้ารหัส password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
    
                const insertSQL = `
                    INSERT INTO user
                    (email, password, first_name, last_name, create_date, create_by, update_date, update_by, status_active)
                    VALUES (?, ?, ?, ?, NOW(), "", NOW(), "", TRUE)
                `;
    
                const values = [email, hashedPassword, firstName, lastName];
    
                db.query(insertSQL, values, (err, results) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Database error", error: err });
                    }
    
                    return res.status(201).json({
                        message: "User created successfully",
                        userId: results.insertId,
                    });
                });
            });
        } catch (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Error processing password" });
        }
    }    
};

module.exports = userController;
