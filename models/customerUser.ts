import Sequelize from 'Sequelize';
import db from '../config/database';

const customerUser = db.define('customer_user',{
    customer_user_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    name:{
        type: Sequelize.STRING(255),
        allowNull: true
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
    shopping_cart_items:{
        type: Sequelize.JSON,
        allowNull: true
    },
    bookmark: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
}, 
    {
        freezeTableName: true,
        tableName: 'customer_user',
        timestamps: false
    })

export default customerUser;