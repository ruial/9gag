#! /usr/bin/env node

function main() {
  console.log('called as command line app');
}

if (require.main === module) {
  main();
}
