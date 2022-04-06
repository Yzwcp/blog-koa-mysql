const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize ,Deferrable} = require("sequelize");
const {Bulk} = require('../bulk/static')

class Order extends Model {}

Order.init({
  // 在这里定义模型属性
  // id: {
  //   type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  // },
  id: {
    primaryKey:true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  },
  //1普通用户 100 管理员
  creator: {
    type: DataTypes.STRING,
    allowNull:false
  },
  openid: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull:false

  },
  helperavatars:{
    type: DataTypes.STRING,
  },
  helperopenids:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  status:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  bulk_id: {
    type: DataTypes.STRING,
    allowNull:false
  },
  endtime:{
    type: DataTypes.STRING,
    allowNull:false
  },
  createdAt:{
    type: DataTypes.DATE
  },
  updatedAt :{
    type: DataTypes.DATE
  },

}, {
  // 这是其他模型参数
  timestamps: true,
  sequelize,
  modelName: 'bulkorders'
});

module.exports.Order = Order
