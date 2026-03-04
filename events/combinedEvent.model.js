const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        userID: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: false },
        filename: { type: DataTypes.STRING, allowNull: false },
        adviceID: { type: DataTypes.INTEGER, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        eventDate: { type: DataTypes.STRING, allowNull: false },
        eventID: { type: DataTypes.INTEGER, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('CombinedEvent', attributes, options);
}