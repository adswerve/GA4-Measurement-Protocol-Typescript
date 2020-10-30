# Instructions on how to compile, update, and publish this npm package

## Dependencies
- node https://nodejs.org/en/
- npm https://nodejs.org/en/
- typescript (npm install -g typescript )
- Have an account on npm (https://www.npmjs.com/)
- login to npm from terminal (npm adduser)


## To compile typescript file:
- Open terminal
- Navigate to root level of file: GA4-Measurement-Protocol-Typescript/
- type: tsc
- Compilation output to dist/

## To publish updates to npm:
- change version number in package.json
- run the following command, replacing <update_type> with one of the semantic versioning release types (patch, major, or minor):  npm version <update_type>
- npm publish
