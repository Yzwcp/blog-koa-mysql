const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class Article extends Model {}
Article.init({
  // 在这里定义模型属性
  // id: {
  //   type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  // },
  id: {
    primaryKey:true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  },
  auth: {
    type: DataTypes.STRING,
    allowNull:false
  },
  body: {
    type: DataTypes.STRING(8000),
    // allowNull 默认为 true
    allowNull:false
  },
  password:{
    type: DataTypes.STRING
  },
  tags:{
    type: DataTypes.STRING
  },
  private:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  categorize:{
    type: DataTypes.STRING
  },
  title :{
    type: DataTypes.STRING
  },
  myDescribe :{
    type: DataTypes.STRING
  },
  cover :{
    type: DataTypes.STRING
  },
  likeList :{
    type: DataTypes.STRING
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
  modelName: 'articles'
});

module.exports.Article = Article
