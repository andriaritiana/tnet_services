##### tnet_services
Version: 1.0
Authors: andri (andriaritiana@yahoo.fr), nav (iandrinaval@gmail.com)

##### Environment
For db configs, open config and create a local.json file if there is not and enter your db_config
there should be a db_transnet database and a db_transnet database before you start running the app

##### Install node packages before all running script
npm install

##### Seeding
Two kinds of seeding are available: populate and override:populate
- npm run populate
- npm run override:populate
If you want to purge the tnet database and drop cooperative's database
- npm run purge

##### Testing
It implement mocha and chai unit test
For more information, visit their website and you should see all you need
To run test for the first or with erasing existing test data:
- npm run test:all
To run test:
- npm run test

##### Run the server
If you want to debug, just add :debug
- npm run start (no debug)
- npm run start:debug (debug mode)
