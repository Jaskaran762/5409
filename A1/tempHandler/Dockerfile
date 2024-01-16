FROM python:3.9-slim

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 6050

CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0", "--port=6050" ]