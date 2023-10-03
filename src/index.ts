import { program } from "commander";
import chalk from "chalk";
import { configureCommand } from "./command/configuration.js";
import { deleteConfiguredValues, getConfiguredValues } from "./utils/config.js";
import { getAllEntries } from "./api/redmineService.js";
import {
  calculateTotalHours,
  getFilteredEntries,
} from "./core/allocationLogic.js";
import { createSpinner } from "./utils/spinner.js";

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

program
  .command("time-entries")
  .alias("te")
  .description("Gestiona las imputaciones de tiempo")
  .argument("<action>", "list | hours")
  .action(async (action) => {
    let stopSpinner: () => void;

    switch (action) {
      case "list":
        stopSpinner = createSpinner(
          "Obteniendo imputaciones, por favor espere..."
        );
        const timeEntries = await getFilteredEntries(
          2999,
          "2023-09-01",
          "2023-09-30"
        );

        stopSpinner();
        console.log(chalk.green(JSON.stringify(timeEntries, null, 2)));
        break;
      case "hours":
        stopSpinner = createSpinner("Calculando horas, por favor espere...");
        const allEntries = await getAllEntries();

        stopSpinner();
        console.log(
          chalk.green(
            `Total de horas imputadas entre 2023-09-01 y 2023-09-30: ${calculateTotalHours(
              allEntries,
              2999,
              "2023-09-01",
              "2023-09-30"
            )}`
          )
        );
        break;
      default:
        console.log(chalk.red("Acción no reconocida"));
        break;
    }
  });

program.parse(process.argv.length > 2 ? process.argv : ["", "", "--help"]);
