import { Serl } from './serl.js'

console.log ( `--TEST #1 : does the Serl class / function / object exist?` )
try { console.log ( `OK: CODE [[new Serl]] RETURNED ${new Serl}` ) } 
catch (e) { console.error(e) } 
finally {console.log(`--TEST ENDED--`)}
