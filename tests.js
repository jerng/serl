import  {   Node, 
            Pid

        } from './serl.js'

console.log ( `TEST #1 : does the Node class / function / object exist?` )
try { console.log ( `OK: CODE [[new Node instanceof Node]] RETURNED [[${new Node
    instanceof Node}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('TEST ENDED\n-- ')}

console.log ( `TEST #1.1 : do Node instances have names ?` )
try { console.log ( `OK: CODE [[(new Node('tom')).name]] RETURNED [[${(new
    Node('tom')).name}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('TEST ENDED\n-- ')}

console.log ( `TEST #2 : does the Pid class / function / object exist?` )
try { console.log ( `OK: CODE [[new Pid instanceof Pid]] RETURNED [[${new Pid
instanceof Pid}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('TEST ENDED\n-- ')}
