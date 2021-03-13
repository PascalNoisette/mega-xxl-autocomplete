# Mega XXL autocomplete

Dashboard to search accross several endpoint.

![alt text](./docs/screenshot.png)

Features :
- Autocomplete
- Configurable endpoints
- Support for Elasticsearch, mediawiki, opengrok and redmine endpoints
- Credential storage is encrypted

## Run with docker

```docker run --rm -p3000:3000 -v `pwd`/data/:/app/data netpascal0123/mega-xxl-autocomplete:2.0```

```docker-compose.yml 
version: '2'
services:
  autocomplete:
    image: netpascal0123/mega-xxl-autocomplete:2.0
    restart: unless-stopped
    volumes:
      - ./data:/app/data/
    ports:
      - 3000:3000
```

## Run from sources

This project was bootstrapped with :
- [Next.js](https://nextjs.org/)
- [Reactive Search](https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/)
- [React Admin](https://marmelab.com/react-admin/Readme.html)
- [Api Dev Tools](https://apitools.dev/openapi-schemas/)

### `npm install`

Software dependancies are managed with npm.

### `npm run build`

Builds the frontend app for production to the `build` folder.

### `npm run start`

Serve frontend and backend at [http://localhost:3000](http://localhost:3000) 

### `npm run dev`

Same but for developement.

