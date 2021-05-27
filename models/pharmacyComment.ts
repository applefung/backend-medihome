import Sequelize from 'Sequelize';
import db from '../config/database';

const pharmacyComment = db.define('pharmacy_comment',{
    pharmacy_comment_id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pharmacy_id:{
        type: Sequelize.INTEGER(),
        allowNull: true,
        references: 'pharmacy', // <<< Note, its table's name, not object name
        referencesKey: 'pharmacy_id' // <<< Note, its a column name
    },
    customer_user_id:{
        type: Sequelize.INTEGER(),
        allowNull: true,
        references: 'customer_user', // <<< Note, its table's name, not object name
        referencesKey: 'customer_user_id' // <<< Note, its a column name
    },
    content:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    rating:{
        type: Sequelize.INTEGER(),
        allowNull: true
    },
    comment_date:{
        type: Sequelize.STRING(255),
        allowNull: true
    }
}, 
    {
        freezeTableName: true,
        tableName: 'pharmacy_comment',
        timestamps: false
    })

export default pharmacyComment;