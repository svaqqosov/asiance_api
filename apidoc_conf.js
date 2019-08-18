require('dotenv').load();
const packageJson = require('./package.json');
const fs = require('fs');

const apiDocConf =
{
  title: `Doc for ${packageJson.name}`,
  url: `${process.env.HOSTNAME}`,
  sampleUrl: `${process.env.HOSTNAME}`,
  name: `${packageJson.name} apis`
};
packageJson.apidoc = apiDocConf;

fs.writeFile('./package.json', JSON.stringify(packageJson, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  console.log('The file was saved!');
});
