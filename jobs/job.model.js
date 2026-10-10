const { DataTypes } = require('sequelize');

module.exports = model;

/**
 * Sequelize Model Definition for Job
 * Built using the idea.model.js architecture for Wouter Advice / React Server.
 */
function model(sequelize) {
    const attributes = {
        // Job Title / Role headline (required)
        jobTitle: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Job title is required' }
            }
        },

        // Hiring Organization / Company name (required)
        company: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Company is required' }
            }
        },

        // Date of listing or import (YYYY-MM-DD or ISO string)
        advertDate: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Advert date is required' }
            }
        },

        // Link to the job listing or external advert
        url: {
            type: DataTypes.STRING(2048),
            allowNull: true,
            defaultValue: '#'
        },

        // Region / Area / City (e.g., 'Christchurch', 'Auckland', 'Remote')
        area: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Remote / Global'
        },

        // Salary range or compensation package
        salary: {
            type: DataTypes.STRING,
            allowNull: true
        },

        // Employment type (e.g., 'Full time', 'Contract', 'Part time')
        employmentType: {
            type: DataTypes.STRING,
            allowNull: true
        },

        // Array of highlights / perks stored as JSON
        highlights: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        }
    };

    const options = {
        tableName: 'jobs',
        timestamps: true,
        // Composite index to facilitate fast queries & uniqueness checks
        indexes: [
            {
                name: 'jobs_company_title_idx',
                fields: ['company', 'jobTitle']
            },
            {
                name: 'jobs_advertDate_idx',
                fields: ['advertDate']
            }
        ]
    };

    return sequelize.define('Job', attributes, options);
}