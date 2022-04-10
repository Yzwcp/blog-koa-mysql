const {sequelize} = require("../../connect/mysql.js");
const { Model, DataTypes,Sequelize } = require("sequelize");
const { Order } = require("../order/static.js");
class Bulk extends Model {}
Bulk.init({
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
  image: {
    type: DataTypes.STRING(8000),
    // allowNull 默认为 true
  },
  oldprice:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  price:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  status:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  groupsize:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  title :{
    type: DataTypes.STRING
  },
  endtime :{
    type: DataTypes.BIGINT
  },
  sort :{
    type: DataTypes.INTEGER
  },
  watchered :{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  okpeople :{
    type: DataTypes.INTEGER,
    defaultValue:0
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
  modelName: 'bulks'
});
// Bulk.associate = function() {
//   Bulk.belongsTo(Order, {foreignKey: 'bulk_id'})
// }
module.exports.Bulk = Bulk
