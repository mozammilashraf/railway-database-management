# Railway Management System

1. Create a .env file in root folder.

2. Populate ".env" file with
   DB_USERNAME=<user_name>\
   DB_PASSWORD=<password>\
   DATABASE=<database_name>\
   DB_PORT=3306\
   DB_HOST=localhost\
   SECRET=<any text>

Eg:

DB_USERNAME=root\
DB_PASSWORD=password\
DATABASE=railway_database\
DB_PORT=3306\
DB_HOST=localhost\
SECRET=keyboard cat

3. Install Node Module with

```bash
npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_USERNAME`

`DB_PASSWORD`

`DATABASE`

`DB_PORT`

`DB_HOST`

`SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/M-B-Ali/Railway-Management-System.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

OR for development server

```bash
  npm run devstart
```

Then go to http://localhost:3000/getStarted to Initilize sample data.

## Error

Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';

## Authors

- M Bakhtiyar Ali (20BCS040) [@M-B-Ali](https://github.com/M-B-Ali)
- Mohammed Tanveer Hassan (20BME055) (CBCS) [@Tanveer1x4](https://github.com/Tanveer1x4)
- Mateen Khan (20BCS030) [@Mateenkhan02](https://github.com/MateenKhan02)
- Farhan Bin Zobair (20BCS023) [@farhank7](https://github.com/farhank7)
- Hamdan Sarwar (20BEE028) (CBCS) [@Hamdansarwar](https://github.com/Hamdansarwar)
- Mohd Juned (20BME010) (CBCS) [@ju78832](https://github.com/ju78832)
- Md Mozammil (20BEE033) (CBCS) [@MisterMozammil](https://github.com/MisterMozammil)
- Intekhab Ilyas (20BCS075) [@Intekhabilyas](https://github.com/Intekhabilyas)
- Intisab Ilyas (20BCS076) [@intisabilyas](https://github.com/intisabilyas)
- Vishwajeet Singh Parihar (20BCS053) [o-o-o-VishwajeetSinghParihar-o-o-o](https://github.com/o-o-o-VishwajeetSinghParihar-o-o-o)
