'use strict';

const colors = require(`colors`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const fsstat = promisify(fs.stat);
const readline = require(`readline`);

const {DEFAULT_PATH, MAX_AT_ONCE} = require(`../../model/constants`);
const makeFile = require(`../../model/make-file`);


module.exports = {
  alias: [`--generate`, `-g`],
  description: `Generates up to ${MAX_AT_ONCE} mock accommodation offers in json format and saves the file to provided location. Works in prompt mode.`,

  run: () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `meow >`
    });

    const Stages = {
      INITIAL_QUESTION: `Start generating? ${colors.green.bold(`(y/n)`)}`,
      NUM_QUESTION: `How many offers do you wish to create (max ${MAX_AT_ONCE})?`,
      FILENAME_QUESTION: `Please provide a path where you wish to save your file (default: ${DEFAULT_PATH}).`,
      OVERWRITE_QUESTION: `The catalogue you provided already contains the file with such name. Overwrite it? ${colors.green.bold(`(y/n)`)}`
    };

    let stage = Stages.INITIAL_QUESTION;
    let offersCount = 0;
    let filePath = ``;


    console.log(`Howdy! This wizard will guide you through generation of json file with mock accommodation data.`);

    rl.setPrompt(Stages.INITIAL_QUESTION);
    rl.prompt();

    rl.on(`line`, (userInput) => {
      const proceed = (nextStage) => {
        rl.setPrompt(nextStage);
        stage = nextStage;
        rl.prompt();
      };

      const exit = () => {
        rl.close();
        return;
      };

      const generate = () => {
        makeFile(offersCount, filePath)
          .then(() => {
            console.log(`${colors.green(`File generated successfully. You can find it at ${filePath}`)}`);
            rl.close();
          })
          .catch((e) => {
            console.error(`${colors.red(`File write error: ${e.code}`)}`);
            rl.close();
          });
      };

      switch (stage) {
        // Start
        case Stages.INITIAL_QUESTION:
          if (userInput === `n`) {
            exit();
          }

          proceed(Stages.NUM_QUESTION);
          break;

        // How many
        case Stages.NUM_QUESTION:
          offersCount = +userInput;
          if (Number.isNaN(offersCount)) {
            console.error(`${colors.red(`You must provide a number from 1 to ${MAX_AT_ONCE}; ${typeof userInput} was provided instead.`)}`);
            proceed(Stages.NUM_QUESTION);
            return;
          }

          if (offersCount > MAX_AT_ONCE || offersCount <= 0) {
            console.error(`${colors.red(`Can't generate less than 0 or more than ${MAX_AT_ONCE} offers.`)}`);
            exit();
          }

          proceed(Stages.FILENAME_QUESTION);
          break;

        // Where to save
        case Stages.FILENAME_QUESTION:
          filePath = userInput || DEFAULT_PATH;
          fsstat(filePath)
            .then((stats) => {
              if (stats.isFile()) {
                proceed(Stages.OVERWRITE_QUESTION);
                return;
              }

              if (stats.isDirectory()) {
                console.error(`${colors.red(`${filePath} is a directory. Please specify a file name as well.`)}`);
                rl.prompt();
              }
            })
            .catch(() => generate());
          break;

        // Overwrite
        case Stages.OVERWRITE_QUESTION:
          if (userInput === `n`) {
            exit();
          }

          generate();
          break;

        default:
          rl.close();
      }
    }).on(`close`, () => {
      console.log(`\n${colors.cyan(`Process complete.`)}`);
      process.exit(0);
    }).on(`error`, (e) => {
      console.error(`${colors.red(`Oops, ${e}. Sorry about that.`)}`);
      process.exit(1);
    });
  }
};
