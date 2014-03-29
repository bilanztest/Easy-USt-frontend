# Easy USt Frontend

[![Code Climate](https://codeclimate.com/github/bilanztest/Easy-USt-frontend.png)](https://codeclimate.com/github/bilanztest/Easy-USt-frontend)

## Setup of local single-page-app

### add custom domain to `hosts`

    $ vim /etc/hosts

and then add `easyust.dev` behind `127.0.0.1` like this

```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1        localhost easyust.dev
```

### setup webserver

- add custom SSL certificate
- proxy /api path to node running on port 8080
- support html5 pushstate (history)
- add gzip

####Apache:

```
<VirtualHost *:443>
  SSLEngine On
  
  #   SSL Protocol support:
  #   List the protocol versions which clients are allowed to
  #   connect with. Disable SSLv2 by default (cf. RFC 6176).
  SSLProtocol all -SSLv2

  #   SSL Cipher Suite:
  #   List the ciphers that the client is permitted to negotiate.
  #   See the mod_ssl documentation for a complete list.
  SSLCipherSuite HIGH:MEDIUM:!aNULL:!MD5

  ProxyRequests On
  SSLProxyEngine On
  SSLProxyVerify None

  DocumentRoot "/path/to/root/dir/src"
  ServerName easyust.dev

  # INSERT YOUR PATH
  SSLCertificateFile    "/private/etc/apache2/server.crt"

  # INSERT YOUR PATH
  SSLCertificateKeyFile "/private/etc/apache2/server.key"

  # map remote host
  ProxyPass /api/ https://localhost:8080/api/

  <Directory /path/to/root/dir/src/>
    # html5 pushstate (history) support:
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/index\.html
    RewriteRule (.*) index.html

    # gzip
    <IfModule mod_deflate.c>
      SetOutputFilter DEFLATE
      
      # Don’t compress
      SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-gzip dont-vary
      SetEnvIfNoCase Request_URI \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
      
      # Dealing with proxy servers
      <IfModule mod_headers.c>
        Header append Vary User-Agent
      </IfModule>
    </IfModule>
  </Directory>
</VirtualHost>
```

####NGINX:

```
# HTTP server
server {
  # Make site accessible from http://localhost/
  server_name localhost;

  return 301 https://$host;
}

# HTTPS server
server {
  listen 443;
  server_name localhost;

  root /path/to/root/dir/src;
  index index.html index.htm;

  ssl on;
  ssl_certificate /etc/nginx/ssl/server.crt;
  ssl_certificate_key /etc/nginx/ssl/server.key;

  ssl_session_timeout 5m;

  gzip on;
  gzip_min_length 1000;
  gzip_types application/json application/x-javascript text/css;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ^~ /api {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass https://127.0.0.1:8080;
    proxy_redirect off;
  }
}

```
