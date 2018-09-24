const PARAMS = {
  version: '--version',
  help: '--help'
};


(function echo () {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case PARAMS.version:
      console.log('KeksoNode v.0.0.1');
      process.exit(0);
      break;

    case PARAMS.help:
      console.log(`
      Available commands:
      --help - print this message;
      --version - show app's current version.
      `);
      process.exit(0);
      break;

    case undefined:
      console.log(`
      Hey youser!
      This script will setup and run the Keksobooking server.
      Author: Keks.
      `);
      process.exit(0);
      break;

    default:
      console.error(`
      Unknown param: ${args[0]}.
      To view a list of available options, please type "--help".
      `);
      process.exit(1);
  }
})();
