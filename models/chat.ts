import Sequelize from 'Sequelize';
import db from '../config/database';

const chat = db.define('chat',{
    room_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customer_user_id:{
        type: Sequelize.STRING(255),
        allowNull: true,
        references: 'customer_user', // <<< Note, its table's name, not object name
        referencesKey: 'customer_user_id' // <<< Note, its a column name
    },
    pharmacy_id:{
        type: Sequelize.STRING(255),
        allowNull: true,
        references: 'pharmacy', // <<< Note, its table's name, not object name
        referencesKey: 'pharmacy_id' // <<< Note, its a column name
    },
    content:{
        type: Sequelize.JSON,
        allowNull: true
    }
}, 
    {
        freezeTableName: true,
        tableName: 'chat',
        timestamps: false
    })

export default chat;