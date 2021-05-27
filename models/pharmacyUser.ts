import Sequelize from 'Sequelize';
import db from '../config/database';

const pharmacyUser = db.define('pharmacy_user',{
    pharmacy_user_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pharmacy_id: {
        type: Sequelize.INTEGER(),
        allowNull: false,
        references: 'pharmacy', // <<< Note, its table's name, not object name
        referencesKey: 'pharmacy_id' // <<< Note, its a column name
    },
    email:{
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    password:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    registered_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    verification_code:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
}, 
    {
        freezeTableName: true,
        tableName: 'pharmacy_user',
        timestamps: false
    })

export default pharmacyUser;