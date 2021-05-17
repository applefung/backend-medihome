import Sequelize from 'Sequelize';
import db from '../config/database';

const pharmacy = db.define('pharmacy',{
    pharmacy_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    product_ids:{
        type: Sequelize.STRING(255),
        allowNull: true,
        references: 'pharmacy', // <<< Note, its table's name, not object name
        referencesKey: 'pharmacy_id' // <<< Note, its a column name
    },
    name_en:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    name_cn:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    address_en:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    address_cn:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    description_en:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    description_cn:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    business_time:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    contact:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    image:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    tag:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
}, 
    {
        freezeTableName: true,
        tableName: 'pharmacy',
        timestamps: false
    })

export default pharmacy;