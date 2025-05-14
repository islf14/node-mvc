#!/usr/bin/env node

// This is used as an example in the README for:
//    Common option types, boolean and value

import { Command } from 'commander'
const program = new Command()

program
  .option('--no-sauce', 'Remove sauce')
  .option('--no-cheese', 'plain with no cheese')
  .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  .parse()

const options = program.opts()
console.log(options.sauce)
const sauceStr = options.sauce ? 'sauce' : 'no sauce'
console.log(options.cheese)
const cheeseStr = (options.cheese === false) ? 'no cheese' : `${options.cheese} cheese`
console.log(`You ordered a pizza with ${sauceStr} and ${cheeseStr}`)
