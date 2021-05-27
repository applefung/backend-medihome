import Sequelize from 'Sequelize';
import db from '../config/database';

const pharmacyAuthenticationToken = db.define('pharmacy_authorization_token',{
    token:{
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pharmacy_user_id:{
        type: Sequelize.INTEGER(),
        allowNull: true,
        references: 'pharmacy_user', // <<< Note, its table's name, not object name
        referencesKey: 'pharmacy_user_id' // <<< Note, its a column name
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
        tableName: 'pharmacy_authorization_token',
        timestamps: false
    })

export default pharmacyAuthenticationToken;