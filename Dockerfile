FROM alpine:3.5

COPY server /server
COPY client /client

RUN apk --update --no-cache add \
        bash \
        git \
        nodejs \
        python3

# Python
RUN ln -s /usr/bin/python3 /usr/bin/python \
    && ln -s /usr/bin/pip3 /usr/bin/pip

RUN pip install -U pip setuptools gunicorn

RUN pip install -r server/requirements.txt

RUN npm -g install bower

RUN bower --allow-root install /client

# Run the app
WORKDIR /server
CMD /usr/bin/gunicorn app:main
EXPOSE 8000
