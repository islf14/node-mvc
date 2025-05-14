import os from 'node:os'
import repl from 'node:repl'

repl.start({
  prompt: '>>> ',
  eval: function (str) {
    const horizontalLine = function () {
      console.log('---------------------------------')
    }
    if (str.indexOf('systemInformation') > -1) {
      horizontalLine()
      console.log(os.version())
      horizontalLine()
      console.log(os.arch())
      horizontalLine()
      console.log(os.cpus())
      horizontalLine()
      console.log(os.totalmem())
      horizontalLine()
      console.log(os.hostname())
      horizontalLine()
      console.log(os.platform())
      horizontalLine()
      console.log(os.release())
      horizontalLine()
      console.log(os.userInfo())
    }
  }
})

// repl.start({ prompt: '> ', eval: myEval, writer: myWriter })

// function myEval (cmd, context, filename, callback) {
//   callback(null, cmd)
// }

// function myWriter (output) {
//   return output.toUpperCase()
// }
