#!/usr/bin/env node

import open from "open"
import { snitch } from "../index.mjs"

const args = process.argv.slice(2)
const wantsHelp = ["help", "h", "-h", "--help"].includes(args[0])
wantsHelp && open("https://github.com/4awpawz/snitch")
!wantsHelp && await snitch(args)
