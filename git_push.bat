@echo off
echo "========git add .=========="
git add .
echo "========�޸�����������=========="
git status
set /p input=�����˱����ύ�����ݣ�
git commit -m %input%
git push git@github.com:Yzwcp/blog-koa-mysql.git master
pause