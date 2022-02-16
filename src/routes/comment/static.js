const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
class Comment extends Model {}
Comment.init({
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER, autoIncrement: true,primaryKey:true
  },
  // id: {
  //   primaryKey:true,
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  articleId:{
    type: DataTypes.STRING,
  },
  blackList:{
    type: DataTypes.STRING,
  },
  likeList:{
    type: DataTypes.STRING,
  },
  nickName:{
    type: DataTypes.STRING,
  },
  parentId:{
    type: DataTypes.STRING,
  },
  type:{
    type: DataTypes.STRING,
  },
  userId:{
    type: DataTypes.STRING,
  },
  value:{
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
  modelName: 'atc_comments' // 我们需要选择模型名称
});

module.exports.Comment = Comment
