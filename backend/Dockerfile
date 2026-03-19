FROM node:20-alpine
WORKDIR /app
RUN echo '{"name":"backend","version":"1.0.0"}' > package.json
RUN echo 'console.log("Backend placeholder (yes it is) running")' > index.js
CMD ["node", "index.js"]