FROM python:3.9-slim

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

RUN pip install pandas

RUN pip install requests

COPY . .

EXPOSE 6000

CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0", "--port=6000" ]