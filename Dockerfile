FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY package*.json ./

RUN apt-get update \
    && apt-get install -y wget curl gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash

RUN apt-get upgrade -y && apt-get install -y nodejs

RUN apt-get install -y build-essential

RUN npm install

COPY . .

RUN chmod +x *.sh

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npm", "start"]