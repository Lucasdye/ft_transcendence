FROM python:3

WORKDIR /usr/src/django-app

COPY ./ .

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x ./bash_scripts/wait-for-it.sh

EXPOSE 8000

CMD ./bash_scripts/wait-for-it.sh postgres:5432 -- bash -c "python manage.py makemigrations && python manage.py migrate && python runserver.py"