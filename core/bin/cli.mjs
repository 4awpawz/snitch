#!/usr/bin/env node

import { snitch } from "../index.mjs"

const args = process.argv.slice(2)
const wantsHelp = ["help", "h", "-h", "--help"].includes(args[0])
wantsHelp && console.log("For help please see https://github.com/4awpawz/snitch")
!wantsHelp && await snitch(args)
