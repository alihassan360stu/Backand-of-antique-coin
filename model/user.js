const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        file_path: { type: DataTypes.STRING, allowNull: true },

    };

    const User = sequelize.define('User', attributes);

    return User; 
};
