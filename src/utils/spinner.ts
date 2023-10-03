import { Spinner } from "cli-spinner";

export const createSpinner = (message: string): (() => void) => {
  const spinner = new Spinner(message);
  spinner.start();

  // Devolvemos la función de cancelación (para detener el spinner)
  return () => {
    spinner.stop(true);
  };
};
