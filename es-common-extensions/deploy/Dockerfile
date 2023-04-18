FROM httpd:2
COPY ./build /usr/local/apache2/htdocs
RUN sed -i -e '$aTraceEnable off' /usr/local/apache2/conf/httpd.conf
