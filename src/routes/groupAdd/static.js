const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class GroupAdd extends Model {}
const times = new Date().getTime()
GroupAdd.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  },
  // id: {
  //   primaryKey:true,
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  bulk_id: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
  },
  order_id:{
    type: DataTypes.STRING,
    // allowNull 默认为 true
  },
  openid:{
    type: DataTypes.STRING,
    // allowNull 默认为 true
  },
  nickname:{
    type: DataTypes.STRING,
    // allowNull 默认为 true
  },
  avatars:{
    type: DataTypes.STRING,
    // allowNull 默认为 true
  },
  status:{
    type: DataTypes.INTEGER,
  },
  parent:{
    type: DataTypes.INTEGER,
  },
  startime:{
    type: DataTypes.BIGINT,
  },
  uid:{
    type: DataTypes.INTEGER,
  },
  createdAt:{
    type: DataTypes.DATE
  },
  updatedAt :{
    type: DataTypes.DATE
  }
}, {
  // 这是其他模型参数
  timestamps: true,
  sequelize, // 我们需要传递连接实例
  modelName: 'group_add' // 我们需要选择模型名称
});
module.exports.GroupAdd = GroupAdd
