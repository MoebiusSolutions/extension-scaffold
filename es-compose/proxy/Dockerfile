FROM httpd:2.4.61-bookworm

RUN echo "IncludeOptional conf/conf.d/*.conf" >> /usr/local/apache2/conf/httpd.conf 

CMD ["httpd", "-DFOREGROUND"]
