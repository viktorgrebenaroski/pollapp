// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'Viktorpp123!',
      database: 'pollapp'
    },
    migrations: {
      directory: './db/migrations'
    },
    debug: false
  },

  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'Viktorpp123!',
      database: 'pollapp'
    }
  }

};
