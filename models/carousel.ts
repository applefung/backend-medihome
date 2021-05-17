import Sequelize from 'Sequelize';
import db from '../config/database';

const carousel = db.define('carousel',{
    carousel_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    image:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    link:{
        type: Sequelize.TEXT,
        allowNull: true
    },
}, 
    {
        freezeTableName: true,
        tableName: 'carousel',
        timestamps: false
    })

export default carousel;