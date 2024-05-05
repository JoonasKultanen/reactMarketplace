FROM node:18-alpine
COPY . /opt/app/
WORKDIR /opt/app
ENV PORT=5000
EXPOSE 5000
RUN npm install --omit=dev
CMD ["npm", "run", "start"]