pathto="/home/arfy/workspace/pathfindersheetthing"
cp $pathto/index.html $pathto/404.html;
cp -r $pathto/* /usr/share/nginx/pathfindersheetthing;
systemctl restart nginx.service;