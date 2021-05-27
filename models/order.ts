import Sequelize from 'Sequelize';
import db from '../config/database';

const order = db.define('order',{
    order_id:{
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
    pharmacy_ids:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    product_ids:{
        type: Sequelize.JSON,
        allowNull: true
    },
    address:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    contact:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    remark:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    delivery_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    order_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    sum_of_total:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
}, 
    {
        freezeTableName: true,
        tableName: 'order',
        timestamps: false
    })

export default order;