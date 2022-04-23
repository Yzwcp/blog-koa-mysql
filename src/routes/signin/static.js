const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class SignIn extends Model {}
SignIn.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  },
  // id: {
  //   primaryKey:true,
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  uid:{
    type: DataTypes.STRING,
    allowNull:false

  },
  signdate:{
    type: DataTypes.BIGINT,
    allowNull:false
  },
  source:{
    type: DataTypes.STRING,
    allowNull:false

  },
  score:{
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
  modelName: 'sign_in' // 我们需要选择模型名称
});

module.exports.SignIn = SignIn
