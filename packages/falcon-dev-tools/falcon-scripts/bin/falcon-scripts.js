#!/usr/bin/env node

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
});
process.on('uncaughtException', ex => {
  console.log('Uncaught Exception: ', ex);
});

const fs = require('fs-extra');
const { paths, promise } = require('../src/tools');
const test = require('../src/test');

(async () => {
  const script = process.argv[2];
  const packagePath = process.cwd();

  try {
    switch (script) {
      case 'build': {
        const results = await promise.reflectAll(
          [
            require('../src/build-dts').build({ packagePath }),
            require('../src/build-esm').build({ packagePath }),
            require('../src/build-cjs').main({ packagePath }),
            fs.existsSync(paths.pkgBinSrc) && require('../src/build-cjs').bin({ packagePath })
          ].filter(x => x)
        );

        if (results.some(x => !x.isSuccess)) {
          throw new Error('Build failed.');
        }

        break;
      }

      case 'watch': {
        const results = await promise.reflectAll([
          require('../src/build-dts').watch({ packagePath }),
          require('../src/build-esm').watch()
        ]);

        if (results.some(x => !x.isSuccess)) {
          throw new Error('Watch failed.');
        }

        break;
      }

      case 'clean': {
        const clean = require('../src/clean');

        await clean();
        break;
      }

      case 'test': {
        await test.watch({ packagePath });
        break;
      }

      case 'test:coverage': {
        await test.coverage({ packagePath });
        break;
      }

      default:
        console.log(`Unknown script "${script}".`);
        console.log('Perhaps you need to update @deity/falcon-scripts?');
        process.exit();

        break;
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
