const username = "Username";
const email = "admin@example.com";
const firstName = "Admin First Name";
const lastName = "Admin Last Name";
const phoneNo = "0000000000";
const dateOfBirth = "2000-01-01";
const password = "password";
const accessLevel = 10;

const states = [
  { stateName: "Andhra Pradesh" },
  { stateName: "Assam" },
  { stateName: "Bihar" },
  { stateName: "Chhattisgarh" },
  { stateName: "Delhi" },
  { stateName: "Haryana" },
  { stateName: "Jharkhand" },
  { stateName: "Karnataka" },
  { stateName: "Madhya Pradesh" },
  { stateName: "Maharashtra" },
  { stateName: "Punjab" },
  { stateName: "Rajasthan" },
  { stateName: "Telangana" },
  { stateName: "Tripura" },
  { stateName: "Uttar Pradesh" },
  { stateName: "West Bengal" },
];

const zones = [
  { zoneName: "Central Railway", zoneCode: "CR" },
  { zoneName: "East Central Railway", zoneCode: "ECR" },
  { zoneName: "Eastern Railway", zoneCode: "ER" },
  { zoneName: "Northern Railway", zoneCode: "NR" },
  { zoneName: "North Central Railway", zoneCode: "NCR" },
  { zoneName: "North Eastern Railway", zoneCode: "NER" },
  {
    zoneName: "Northeast Frontier Railway",
    zoneCode: "NFR",
  },
  { zoneName: "North Western Railway", zoneCode: "NWR" },
  { zoneName: "South Central Railway", zoneCode: "SCR" },
  {
    zoneName: "South East Central Railway",
    zoneCode: "SECR",
  },
  { zoneName: "South Western Railway", zoneCode: "SWR" },
  { zoneName: "West Central Railway", zoneCode: "WCR" },
];

const classTypes = [
  { classTypeName: "AC First Class (1A)", classTypeCode: "1A" },
  { classTypeName: "AC Two-Tier (2A)", classTypeCode: "2A" },
  { classTypeName: "AC Three-Tier (3A)", classTypeCode: "3A" },
  { classTypeName: "First Class (FC)", classTypeCode: "FC" },
  {
    classTypeName: "Executive Chair Car (EC)",
    classTypeCode: "EC",
  },
  {
    classTypeName: "AC Three-Tier Economy (3E)",
    classTypeCode: "3E",
  },
  { classTypeName: "AC Chair Car (CC)", classTypeCode: "CC" },
  { classTypeName: "Sleeper Class (SL)", classTypeCode: "SL" },
  { classTypeName: "Second Seater (2S)", classTypeCode: "2S" },
  {
    classTypeName: "General/Unreserved (GEN/UR)",
    classTypeCode: "GEN/UR",
  },
];

const trainTypes = [
  { trainTypeName: "SuperFast", trainTypeCode: "SF" },
  { trainTypeName: "Mail/Express", trainTypeCode: "Exp" },
  { trainTypeName: "Rajdhani", trainTypeCode: "Raj" },
  { trainTypeName: "Shatabdi", trainTypeCode: "Shtb" },
  { trainTypeName: "Duronto", trainTypeCode: "Drnt" },
  { trainTypeName: "Sampark Kranti", trainTypeCode: "SKr" },
];

const trains = [
  {
    "train-no": "12505",
    "train-name": "North East Express (PT)",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A"],
    "return-train-no": "12506",
  },
  {
    "train-no": "12506",
    "train-name": "North East Express",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A"],
    "return-train-no": "12505",
  },
  {
    "train-no": "12723",
    "train-name": "Telangana Express (PT)",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "12724",
  },
  {
    "train-no": "12724",
    "train-name": "Telangana Express (PT)",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "12723",
  },
  {
    "train-no": "18237",
    "train-name": "Chhattisgarh Express (PT)",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "18238",
  },
  {
    "train-no": "18238",
    "train-name": "Chhattisgarh Express (PT)",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "18237",
  },
  {
    "train-no": "12313",
    "train-name": "Sealdah - New Delhi Rajdhani Express",
    "train-type-code": "Raj",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "12314",
  },
  {
    "train-no": "12314",
    "train-name": "New Delhi - Sealdah Rajdhani Express",
    "train-type-code": "Raj",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "12313",
  },
  {
    "train-no": "20501",
    "train-name": "Agartala - Anand Vihar Terminal Tejas Rajdhani Express",
    "train-type-code": "Raj",
    "running-days": [0, 1, 0, 0, 0, 0, 0],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "20502",
  },
  {
    "train-no": "20502",
    "train-name": "Anand Vihar Terminal - Agartala Tejas Rajdhani Express",
    "train-type-code": "Raj",
    "running-days": [0, 0, 0, 1, 0, 0, 0],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "20501",
  },
  {
    "train-no": "11107",
    "train-name": "Bundelkhand Express",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["SL", "3A", "2A", "1A"],
    "return-train-no": "11108",
  },
  {
    "train-no": "11108",
    "train-name": "Bundelkhand Express",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["SL", "3A", "2A", "1A"],
    "return-train-no": "11107",
  },
  {
    "train-no": "12259",
    "train-name": "Sealdah - Bikaner AC Duronto Express",
    "train-type-code": "Drnt",
    "running-days": [1, 1, 0, 1, 1, 0, 0],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "12260",
  },
  {
    "train-no": "12260",
    "train-name": "Bikaner - Sealdah AC Duronto Express",
    "train-type-code": "Drnt",
    "running-days": [0, 1, 1, 0, 1, 1, 0],
    classes: ["3A", "2A", "1A"],
    "return-train-no": "12259",
  },
  {
    "train-no": "12649",
    "train-name": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
    "train-type-code": "SKr",
    "running-days": [1, 1, 0, 1, 0, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "12650",
  },
  {
    "train-no": "12650",
    "train-name": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
    "train-type-code": "SKr",
    "running-days": [1, 1, 1, 0, 1, 0, 1],
    classes: ["2S", "SL", "3A", "2A", "1A"],
    "return-train-no": "12649",
  },
  {
    "train-no": "12487",
    "train-name": "Seemanchal Express",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A", "3E"],
    "return-train-no": "12488",
  },
  {
    "train-no": "12488",
    "train-name": "Seemanchal Express",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "FC", "1A"],
    "return-train-no": "12487",
  },
  {
    "train-no": "12279",
    "train-name": "Taj Express",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "CC"],
    "return-train-no": "12280",
  },
  {
    "train-no": "12280",
    "train-name": "Taj Express",
    "train-type-code": "SF",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "CC"],
    "return-train-no": "12279",
  },
  {
    "train-no": "15483",
    "train-name": "Sikkim Mahananda Express",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A"],
    "return-train-no": "15484",
  },
  {
    "train-no": "15484",
    "train-name": "Sikkim Mahananda Express",
    "train-type-code": "Exp",
    "running-days": [1, 1, 1, 1, 1, 1, 1],
    classes: ["2S", "SL", "3A", "2A"],
    "return-train-no": "15483",
  },
  {
    "train-no": "12049",
    "train-name": "Gatiman Express",
    "train-type-code": "Shtb",
    "running-days": [1, 1, 1, 1, 1, 0, 1],
    classes: ["CC", "EC"],
    "return-train-no": "12050",
  },
  {
    "train-no": "12050",
    "train-name": "Gatiman Express",
    "train-type-code": "Shtb",
    "running-days": [1, 1, 1, 1, 1, 0, 1],
    classes: ["CC", "EC"],
    "return-train-no": "12049",
  },
];

exports.username = username;
exports.email = email;
exports.firstName = firstName;
exports.lastName = lastName;
exports.phoneNo = phoneNo;
exports.dateOfBirth = dateOfBirth;
exports.password = password;
exports.accessLevel = accessLevel;

exports.states = states;
exports.zones = zones;
exports.classTypes = classTypes;
exports.trainTypes = trainTypes;
exports.trains = trains;
