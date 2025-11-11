# 🌩️ TempDrive — Full Stack File Sharing App

A full-stack application for uploading and sharing files.

---

## 🚀 Deployment Guide

This guide explains how to set up TempDrive from scratch — from cloning the repo to serving it securely over HTTPS using Apache.

---

## 🧮 Prerequisites

Ensure the following are installed on your device:

| Component          | Recommended Version |
| ------------------ | ------------------- |
| Java               | JDK 23 or newer     |
| Node.js            | latest              |
| npm                | latest              |
| Apache HTTP Server | latest              |
| Git                | latest              |
| OS                 | RHEL 9 or similiar  |

Note: For this project, the guide will be as installing on RHEL as that is what I used, so if you are using any other distribution, you can mold it accordingly.

---

## 📦 1. Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/t0ugh-guy/TempDrive.git
cd TempDrive
```

---

## ⚙️ 2. Setup Backend (Spring Boot)

### Install Java (Temurin JDK)

For AlmaLinux / RHEL / CentOS 9:

```bash
sudo dnf install temurin-25-jdk -y
```

Note: For this project I used temurin jdk because generally its one that has the longest support, you can use jdk from any distributor. Before running 'dnf install', make sure you have the required RPM repo added to your system. 

### Build the Spring Boot App and copy .jar file to /opt

```bash
cd /opt/TempDrive/Backend_Springboot
./mvnw clean package -DskipTests
sudo cp target/*.jar /opt/myApp.jar
```



**Setup Database for Backend**

This backend supports MySQL out of the box, you just need to add your connection details to the application, to use any other database you might need to do some hardwork setting up drivers....&#x20;

To add configuration details for MySQL, create `.env` file and add details in it:

```
DB_URL=<jdbc:mysql://domain.com:port/databse_name>
DB_USER=<username>
DB_PASS=<password>
```

---

## 🧬 3. Create a Systemd Service for the Backend

Create a new service file:

```bash
sudo nano /etc/systemd/system/springboot.service
```

Paste the following:

```ini
[Unit]
Description=Spring Boot Application
After=network.target

[Service]
User=apache
WorkingDirectory=/opt
Environment="JAVA_HOME=/usr/lib/jvm/temurin-25-jdk"
ExecStart=/usr/lib/jvm/temurin-25-jdk/bin/java -jar /opt/myApp.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Here, you can set Working Directory, Environment, and ExecStart as you want (as per java and .jar file location in you device)

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable springboot
sudo systemctl start springboot
sudo systemctl status springboot
```

Check logs:

```bash
sudo journalctl -u springboot -f
```

Backend now runs on `http://localhost:8080`

---

## 🌐 4. Setup Frontend (React + Vite)

### Install dependencies

```bash
cd /opt/TempDrive/Frontend_react
npm install
```

### Environment configuration

Create `.env.production`:

```
VITE_BASE_URL=/tempdrive/
VITE_API_URL=
```

### Build frontend

```bash
npm run build
```

Output will appear in:

```
/opt/TempDrive/Frontend_react/dist/
```

---

## 🕸️ 5. Deploy Frontend via Apache

Note: I had used Apache to deploy, you may use any other service and adapt the instructions accordingly.

### Copy build to web root

```bash
sudo mkdir -p /var/www/html/tempdrive
sudo cp -r dist/* /var/www/html/tempdrive/
```

### Apache Reverse Proxy Setup

Install required modules:

```bash
sudo dnf install mod_ssl -y
sudo dnf install mod_proxy_html -y
```

Enable required modules (if not already):

```bash
sudo httpd -M | grep proxy
```

If missing, load them manually by adding to `/etc/httpd/conf/httpd.conf`:

```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

Restart Apache:

```bash
sudo systemctl restart httpd
```

---

## 🧩 6. Apache Virtual Host Configuration

Edit your SSL virtual host file:

```bash
sudo nano /etc/httpd/conf.d/webroot-le-ssl.conf
```

Note: Your main used file may be different. By default it is generally `ssl.conf` but for me it was as in above command.

Replace or add (make sure it is before `</VirtualHost>`):

```apache
    # Frontend React App
    Alias /tempdrive /var/www/html/tempdrive
    <Directory /var/www/html/tempdrive>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        FallbackResource /tempdrive/index.html
    </Directory>

    # Reverse proxy for Spring Boot backend
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /tempdrive !
    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/
```

Restart Apache:

```bash
sudo systemctl restart httpd
```

🛡️ Your app is now accessible at:

> [https://\<public IP of device>/tempdrive/](https://vm1.shaantiwana.uk/tempdrive/)
>
> You may use http instead of https if you have not configured a certificate for the same.

---

## 🧠 Notes on Apache Reverse Proxy Setup

- `/` prefix is proxied to Spring Boot (port 8080)
- `/tempdrive/` serves static frontend files
- `FallbackResource` ensures React routes work on refresh
- HTTPS can be configured via Let’s Encrypt (`certbot --apache`)

If your backend runs on another port, you may adjust:

```
ProxyPass /api/ http://localhost:<port>/
ProxyPassReverse /api/ http://localhost:<port>/
```

---

## 🥉 Debugging

| Issue                 | Command                                         |
| --------------------- | ----------------------------------------------- |
| Check backend logs    | `sudo journalctl -u springboot -f`              |
| Check Apache logs     | `sudo tail -f /var/log/httpd/webroot_error.log` |
| Test backend directly | `curl http://localhost:8080/api/health`         |
| Test proxy            | `curl -I https://your-domain/api/health`        |
| Check app paths       | `ls /var/www/html/tempdrive`                    |

---

## ❤️ Credits

Created by **Gurshaan Tiwana (t0ugh-guy).**\
Built with **Spring Boot**, **React + Vite**, and **Apache**.

