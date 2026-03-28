const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        description: { type: DataTypes.STRING(2000), allowNull: false },
        ideaDate: { type: DataTypes.STRING, allowNull: false },
        ideaFilename: { type: DataTypes.STRING(1000), allowNull: false }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Idea', attributes, options);
}