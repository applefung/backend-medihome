import Sequelize from 'Sequelize';
import db from '../config/database';

const category = db.define('category',{
    category_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category_en:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    category_cn:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    image:{
        type: Sequelize.STRING(255),
        allowNull: true
    }
}, 
    {
        freezeTableName: true,
        tableName: 'category',
        timestamps: false
    })

export default category;