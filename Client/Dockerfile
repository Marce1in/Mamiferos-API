FROM python:3.12.7-alpine
WORKDIR /client

RUN python3 -m venv venv
ENV PATH="/client/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "main.py"]
