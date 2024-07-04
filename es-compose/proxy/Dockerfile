FROM httpd:2.4.61-bookworm

# Allow conf files in conf.d to be recognized
RUN echo "IncludeOptional conf/conf.d/*.conf" >> /usr/local/apache2/conf/httpd.conf 
