# Test work for job

### To start the project:
### Base
* docker compose up -d --build 
* после нужно зайти в контейнер и выполнить мграции 
* docker compose exec web bash
* cd base && python manage.py makemigrations && python manage.py migrate
* python manage.py createsuperuser
* python manage.py loaddata alldata.json
* exit

### Front
* cd /front && npm install && npm start