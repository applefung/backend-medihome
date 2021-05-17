import Sequelize from 'Sequelize';
import db from '../config/database';

const product = db.define('product',{
    product_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category_id:{
        type: Sequelize.INTEGER(),
        allowNull: true,
        references: 'category', // <<< Note, its table's name, not object name
        referencesKey: 'category_id' // <<< Note, its a column name
    },
    title_en:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    title_cn:{
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
    price:{
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
    }
}, 
    {
        freezeTableName: true,
        tableName: 'product',
        timestamps: false
    })

export default product;