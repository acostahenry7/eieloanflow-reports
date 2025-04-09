// module.exports = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "postgres",
//   DB: "finance",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

//

// module.exports = {
//   HOST: "10.202.5.39",
//   USER: "webadmin",
//   PASSWORD: "EDJKNOSOj6",
//   DB: "finance",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

module.exports = {
  HOST: "node84104-financedb.whelastic.net",
  USER: "webadmin",
  PASSWORD: "EDJKNOSOj6",
  DB: "finance",
  dialect: "postgres",
  // dialectOptions: {
  //   useUTC: false, // for reading from database
  // },
  //timezone: "-04:00",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// // PRODUCCION;
// module.exports = {
//   HOST: "10.202.9.7",
//   USER: "webadmin",
//   PASSWORD: "EDJKNOSOj6",
//   DB: "finance",
//   dialect: "postgres",
//   // dialectOptions: {
//   //   useUTC: false, // for reading from database
//   // },
//   //timezone: "-04:00",
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
