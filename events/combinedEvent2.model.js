const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userID: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: false },
        filename: { type: DataTypes.STRING, allowNull: false },
        adviceID: { type: DataTypes.INTEGER, allowNull: false },
        eventCount: { type: DataTypes.INTEGER, allowNull: false }
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

    return sequelize.define('CombinedEvent2', attributes, options);
}