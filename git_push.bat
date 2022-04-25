@echo off
echo "========git add .=========="
git add .
echo "========修改了以下内容=========="
git status
set /p input=输入后端本次提交的内容：
git commit -m %input%
git push git@github.com:Yzwcp/blog-koa-mysql.git master
pause