const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class User extends Model {}
User.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  },
  // id: {
  //   primaryKey:true,
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  nickName: {
    type: DataTypes.STRING,
    allowNull:false
  },
  auth: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull:false
  },
  email:{
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull:false
  },
  phone:{
    type: DataTypes.STRING,
  },
  password:{
    type: DataTypes.STRING,
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
  modelName: 'user' // 我们需要选择模型名称
});
module.exports.User = User
