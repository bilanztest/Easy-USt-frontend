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

  DocumentRoot "/path/to/root/dir"
  ServerName easyust.dev

  # INSERT YOUR PATH
  SSLCertificateFile    "/private/etc/apache2/server.crt"

  # INSERT YOUR PATH
  SSLCertificateKeyFile "/private/etc/apache2/server.key"

  # map remote host
  ProxyPass /api/ https://localhost:8080/api/

  <Directory /path/to/root/dir/>
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
# coming soon
```
