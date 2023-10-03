import { program } from "commander";
import chalk from "chalk";
import {
  configureCommand,
  deleteConfiguredValues,
  getConfiguredValues,
} from "./command/configuration.js";

program.name("redmine-buddy").version("1.0.0");

program
  .command("configuration")
  .alias("config")
  .description("Configura la aplicación")
  .argument("<action>", "add | get | delete")
  .action(async (action) => {
    switch (action) {
      case "add":
        await configureCommand();
        break;
      case "get":
        try {
          const config = getConfiguredValues();
          console.log(chalk.green(JSON.stringify(config, null, 2)));
        } catch (error: unknown) {
          console.log(chalk.red((error as Error).message));
        }
        break;
      case "delete":
        deleteConfiguredValues();
        console.log(chalk.green("Configuración eliminada correctamente"));
        break;
      default:
        console.log(chalk.red("Acción no reconocida"));
        break;
    }
  });

program.parse(process.argv.length > 2 ? process.argv : ["", "", "--help"]);
