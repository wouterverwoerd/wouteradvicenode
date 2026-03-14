const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        content: { type: DataTypes.STRING(2000), allowNull: false },
        userid: { type: DataTypes.STRING, allowNull: false },
        touserid: { type: DataTypes.STRING, allowNull: false },
        filename: { type: DataTypes.STRING(1000), allowNull: false }
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

    return sequelize.define('Advice', attributes, options);
}