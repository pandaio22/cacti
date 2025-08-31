import knex from "knex";
import config from "./knexfile";

const environment = "development";

export const db = knex(config[environment]);
