let createAgentTable = `CREATE TABLE agent (
  agent_id int NOT NULL AUTO_INCREMENT,
  email varchar(40) NOT NULL,
  username varchar(40) DEFAULT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) DEFAULT NULL,
  phone_no tinyblob,
  DOB date DEFAULT NULL,
  hashed_password blob NOT NULL,
  salt blob NOT NULL,
  agent_since timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  access_level int DEFAULT '0',
  PRIMARY KEY (agent_id),
  UNIQUE KEY email_UNIQUE (email)
);`;

let createAgentRequestTable = `CREATE TABLE request_agent_signup (
  request_agent_signup_id int NOT NULL AUTO_INCREMENT,
  email varchar(40) NOT NULL,
  username varchar(40) DEFAULT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) DEFAULT NULL,
  phone_no tinytext,
  DOB date DEFAULT NULL,
  hashed_password blob NOT NULL,
  salt blob NOT NULL,
  request_datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  response_datetime datetime DEFAULT NULL,
  response_status enum('pending','approved','rejected') NOT NULL,
  response_agent_id int DEFAULT NULL,
  PRIMARY KEY (request_agent_signup_id),
  UNIQUE KEY email_UNIQUE (email)
);`;

let createStateTable = `CREATE TABLE states (
  state_id int NOT NULL AUTO_INCREMENT,
  state_name varchar(40) NOT NULL,
  PRIMARY KEY (state_id),
  UNIQUE KEY state_id_UNIQUE (state_id),
  UNIQUE KEY state_name_UNIQUE (state_name)
);`;

let createZoneTable = `CREATE TABLE zones (
  zone_id int NOT NULL AUTO_INCREMENT,
  zone_name varchar(30) NOT NULL,
  zone_code varchar(7) NOT NULL,
  PRIMARY KEY (zone_id),
  UNIQUE KEY zone_id_UNIQUE (zone_id),
  UNIQUE KEY zone_name_UNIQUE (zone_name),
  UNIQUE KEY zone_code_UNIQUE (zone_code)
);`;

let createTrainTypeTable = `CREATE TABLE train_types (
  train_type_id int NOT NULL AUTO_INCREMENT,
  train_type_name varchar(30) NOT NULL,
  train_type_code char(5) DEFAULT NULL,
  PRIMARY KEY (train_type_id),
  UNIQUE KEY train_type_name_UNIQUE (train_type_name)
);`;

let createClassTypeTable = `CREATE TABLE class_types (
  class_type_id int NOT NULL AUTO_INCREMENT,
  class_type_name varchar(40) NOT NULL,
  class_type_code varchar(6) DEFAULT NULL,
  PRIMARY KEY (class_type_id),
  UNIQUE KEY class_type_id_UNIQUE (class_type_id),
  UNIQUE KEY class_type_name_UNIQUE (class_type_name)
);`;

let createStationTable = `CREATE TABLE stations (
  station_id int NOT NULL AUTO_INCREMENT,
  station_code char(6) NOT NULL,
  station_name varchar(45) NOT NULL,
  state_id int DEFAULT NULL,
  zone_id int DEFAULT NULL,
  PRIMARY KEY (station_id),
  UNIQUE KEY (station_id),
  UNIQUE KEY (station_code)
);`;

let createTrainTable = `CREATE TABLE trains (
  train_id int NOT NULL AUTO_INCREMENT,
  train_no int NOT NULL,
  return_train_no int DEFAULT NULL,
  train_name varchar(60) DEFAULT NULL,
  sunday tinyint DEFAULT NULL,
  monday tinyint DEFAULT NULL,
  tuesday tinyint DEFAULT NULL,
  wednesday tinyint DEFAULT NULL,
  thursday tinyint DEFAULT NULL,
  friday tinyint DEFAULT NULL,
  saturday tinyint DEFAULT NULL,
  train_type_id int DEFAULT NULL,
  PRIMARY KEY (train_id,train_no),
  UNIQUE KEY train_id_UNIQUE (train_id),
  UNIQUE KEY train_no_UNIQUE (train_no)
);`;

let createTrainHasClassTable = `CREATE TABLE train_has_class (
  train_id int NOT NULL,
  class_type_id int NOT NULL,
  PRIMARY KEY (train_id,class_type_id)
);`;

let createTrainTimetableTable = `CREATE TABLE train_timetable (
  train_timetable_id int NOT NULL AUTO_INCREMENT,
  sr_no int NOT NULL,
  train_id int NOT NULL,
  station_id int NOT NULL,
  arrival_time time DEFAULT NULL,
  departure_time time DEFAULT NULL,
  day int NOT NULL,
  distance_traveled decimal(9,2) DEFAULT NULL,
  platform int DEFAULT NULL,
  halt_time time DEFAULT NULL,
  PRIMARY KEY (train_timetable_id)
);`;

exports.createAgentTable = createAgentTable;
exports.createAgentRequestTable = createAgentRequestTable;
exports.createStateTable = createStateTable;
exports.createZoneTable = createZoneTable;
exports.createTrainTypeTable = createTrainTypeTable;
exports.createClassTypeTable = createClassTypeTable;
exports.createStationTable = createStationTable;
exports.createTrainTable = createTrainTable;
exports.createTrainHasClassTable = createTrainHasClassTable;
exports.createTrainTimetableTable = createTrainTimetableTable;
