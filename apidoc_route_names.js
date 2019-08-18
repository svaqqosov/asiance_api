const fs = require('fs');
const path = require('path');

const namedRoute = {};

const getDoc = () => {
  const filePath = path.resolve(`${__dirname}/apidoc/api_data.json`);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) reject(err);
      else resolve(JSON.parse(content));
    });
  });
};
const writeToFile = (data) => {
  const filePath = path.resolve(`${__dirname}/src/routes/route_names.json`);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err, content) => {
      if (err) reject(err);
      else {
        console.log('Routes are written!');
        resolve(content);
      }
    });
  });
};
const makeRouteName = async () => {
  const doc = await getDoc();
  for (let i = 0; i < doc.length; i += 1) {
    const api = doc[i];
    let url = api.url;
    // remove get param
    url = url.split('?').shift();
    const verb = api.type;
    const name = api.name;

    if (namedRoute[url] === undefined) {
      namedRoute[url] = {};
    }

    namedRoute[url][verb] = name;
  }
  await writeToFile(JSON.stringify(namedRoute));
};

makeRouteName();
