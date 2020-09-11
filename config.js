/* 
/create ans export conf variable 
*/

//Container for env variable

const env = {};

// Staging object for local developpement

env.staging = {
    port: 3000,
    envName: "staging",
    hashingSecret: 'KMTCHASH'
};

// production

env.prod = {
    port: 6000,
    envName: "production"
};

// Determine which one to exports dependidng to command line ca;;

const currentEnv =
    typeof (process.env.NODE_ENV) == 'string' ?
    process.env.NODE_ENV.toLowerCase() :
    "";

// Check if the current env is in our env

const envToExport =
    typeof (env[currentEnv]) == 'object' ? env[currentEnv] : env.staging;

module.exports = envToExport;