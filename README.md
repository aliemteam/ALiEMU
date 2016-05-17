[![Build Status](https://travis-ci.org/AcademicLifeInEM/ALiEMU.svg?branch=master)](https://travis-ci.org/AcademicLifeInEM/ALiEMU)
[![Coverage Status](https://coveralls.io/repos/github/AcademicLifeInEM/ALiEMU/badge.svg?branch=master)](https://coveralls.io/github/AcademicLifeInEM/ALiEMU?branch=master)

### Contributing

#### Getting Started

##### Requirements
- [nodejs v6.x](https://nodejs.org/en/)
- [Docker v1.11.x](https://docs.docker.com/engine/installation/)
- [Docker Compose v1.7.x](https://docs.docker.com/compose/install/)
- [Gulp CLI v4.x](http://gulpjs.com/) `npm install --global "gulpjs/gulp-cli#4.0"`
- [Typings](https://github.com/typings/typings) `npm install --global typings`
- Server secrets/passwords (contact an admin if you believe you should have these).

##### Suggested
- TypeScript `npm install --global typescript`
- [Atom Editor](https://atom.io/)
- [Atom TypeScript](https://github.com/TypeStrong/atom-typescript)

 Steps | Command Line Instructions
-------|---------------------------
Clone repo locally and enter the cloned directory|`git clone https://github.com/AcademicLifeInEM/ALiEMU.git && cd ALiEMU`
Install project dependencies | `npm install`
Install typings|`typings install`
Drop the two password files into a directory named `data` at the root of the project|
Pull the database from the server | `./syncup.sh get database`
Pull the plugins from the server | `./syncup.sh get --all-plugins`
Pull the uploads from the server | `./syncup.sh get uploads`
Pull the theme from the server | `./syncup.sh get theme`
Spin up the dev server | `docker-compose up -d`
Wait until the logs say `WordPress Setup Complete` | `docker-compose logs -f wordpress`
Take ownership of the volumed docker directories | `npm run chown`
Start browserSync | `gulp`

When done with your feature, create a pull request from your feature branch to the master branch of this repo.
