import { program } from "commander";
import chalk from "chalk";
import {
  addConfigValuesCommand,
  deleteConfiguredValuesCommand,
  getConfiguredValuesCommand,
} from "./command/configurationCommand.js";
import {
  getTimeEntriesHoursCommand,
  listTimeEntriesCommand,
} from "./command/timeEntryCommand.js";

program.name("redmine-buddy").version("1.0.0");

program
  .command("configuration")
  .alias("config")
  .description("Configura la aplicación")
  .argument("<action>", "add | get | delete")
  .action(async (action) => {
    switch (action) {
      case "add":
        await addConfigValuesCommand();
        break;
      case "get":
        getConfiguredValuesCommand();
        break;
      case "delete":
        deleteConfiguredValuesCommand();
        break;
      default:
        console.log(chalk.red("Acción no reconocida"));
        break;
    }
  });

program
  .command("time-entries")
  .alias("te")
  .description("Gestiona las imputaciones de tiempo")
  .argument("<action>", "list | hours")
  .action(async (action) => {
    switch (action) {
      case "list":
        await listTimeEntriesCommand();
        break;
      case "hours":
        await getTimeEntriesHoursCommand();
        break;
      default:
        console.log(chalk.red("Acción no reconocida"));
        break;
    }
  });

program.parse(process.argv.length > 2 ? process.argv : ["", "", "--help"]);
