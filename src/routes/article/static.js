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
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull:false
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
  password:{
    type: DataTypes.STRING
  }
}, {
  // 这是其他模型参数
  timestamps: true,
  sequelize,
  modelName: 'article'
});

module.exports.Article = Article
