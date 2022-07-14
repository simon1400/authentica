module.exports = {
  apps : [{
    name   : "A-group client",
    script : "yarn start",
    env_production: {
      APP_API: "https://api.authentica.cz",
    }
  }],

  deploy : {
    production : {
      user : 'dimi',
      host : ['89.221.216.23'],
      ref  : 'origin/main',
      repo : 'https://github.com/simon1400/authentica.git',
      path : '/var/www/a-group/client',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --env production',
    }
  }
};
