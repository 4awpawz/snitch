#!/usr/bin/env node

import { ghif } from "./ghif.mjs"

const args = process.argv.slice(2)
const wantsHelp = args.length === 0 || ["help", "h", "-h", "--help"].includes(args[0])
wantsHelp && console.log("For help please see https://github.com/4awpawz/ghif")
!wantsHelp && await ghif(args)
