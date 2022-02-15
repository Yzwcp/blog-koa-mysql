const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class Tags extends Model {}
Tags.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  },
  // id: {
  //   primaryKey:true,
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  label: {
    type: DataTypes.STRING,
    allowNull:false
  },
  value: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull:false
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
  modelName: 'atc_tags' // 我们需要选择模型名称
});

module.exports.Tags = Tags
