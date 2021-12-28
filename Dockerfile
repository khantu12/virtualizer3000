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

RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash

RUN apt-get upgrade -y && apt-get install -y nodejs

RUN apt install -y build-essential libxtst-dev libpng-dev python python3-pip && npm i -g node-gyp

RUN npm i -g yarn && yarn 

COPY . .

EXPOSE 3000

RUN chmod +x *.sh

ENV DISPLAY :99

ENTRYPOINT ["/app/entrypoint.sh"]

# CMD xvfb-run --server-args="-screen 0 1024x768x24" yarn start
CMD ["yarn", "start"]