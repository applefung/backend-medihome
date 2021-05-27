import Sequelize from 'Sequelize';
import db from '../config/database';

const authenticationToken = db.define('authentication_token',{
    token:{
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customer_user_id:{
        type: Sequelize.INTEGER(),
        allowNull: true,
        references: 'customer_user', // <<< Note, its table's name, not object name
        referencesKey: 'customer_user_id' // <<< Note, its a column name
    },
    token_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    expired_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
}, 
    {
        freezeTableName: true,
        tableName: 'authentication_token',
        timestamps: false
    })

export default authenticationToken;