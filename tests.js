import * as Serl from './serl.js'

console.log ( `[TEST #1 : does the Node class / function / object exist?` )
try { console.log ( `OK: CODE [[new Serl.Node instanceof Serl.Node]] RETURNED
    [[${new Serl.Node instanceof Serl.Node}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #1.1 : do Node instances have names ?` )
try { console.log ( `OK: CODE [[(new Serl.Node('tom')).name]] RETURNED [[${(new
    Serl.Node('tom')).name}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #1.2 : does static method Pid.nodeIndexFromNodeName()
    work?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test1.2')
        return Serl.Node.nodeIndexFromNodeName ( n, n.name )
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test1.2')
        return Serl.Node.nodeIndexFromNodeName ( n, n.name )
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #2 : does the Pid class / function / object exist?` )
try { console.log ( `OK: CODE [[
        new Serl.Pid (  'placeholderNodeIndex', 
                        'placeholderProcIndex' ) instanceof Serl.Pid
    ]] RETURNED [[${
        new Serl.Pid (  'placeholderNodeIndex', 
                        'placeholderProcIndex' ) instanceof Serl.Pid
    }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #2.1 : how readable is the Pid's .toString()?` ); try {
    console.log ( `OK: CODE [[ 
        new Serl.Pid ( 'placeholderNodeName', 'placeholderProcIndex' )
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test2.1')
        return new Serl.Pid ( 'placeholderNodeName', 'placeholderProcIndex' )
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #3 : spawn(()=>{})?` )
try { console.log ( `OK: CODE [[
        (new Serl.Node).spawn(()=>{})
    ]] RETURNED [[
        ${(new Serl.Node).spawn(()=>{})}
    ]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #3.1 : spawn(1)?` )
try { console.error ( `NO ERROR THROWN: CODE [[ 
        (new Serl.Node).spawn(1)
    ]] RETURNED [[
        ${(new Serl.Node).spawn(1)}
    ]]` ) } 
catch (e) { console.log(`OK: CODE [[
        (new Serl.Node).spawn(1)
    ]] RETURNED [[
        ${( e instanceof Error) 
                ? e 
                : new Error('Expected an error, did not obtain one.')}
    ]]`) } 
finally {console.log('] - - ')}

console.log ( `[TEST #3.2 : do successive calls to spawn() increment the Proc
Pids in the Node's procMap?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST #3.n : tests for arities != 1, unwritten at this time; NO DISTRIBUTED COMPUTING.]` )

console.log ( `[TEST #3.3 : process is spawned, then what?` ); 
try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test3.3')
        let p = n.spawn( ()=>{console.log(\`NEWS: spawn/1 was called on a function body
        containing this line\`)} )
        return p
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test3.3')
        let p = n.spawn( ()=>{console.log(`NEWS: spawn/1 was called on a function body
        containing this line`)} )
        return p
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #4 : Node's procMap is readable ?` )
try { console.log ( `OK: CODE [[ (new Serl.Node).procMap.counter ]] RETURNED
    [[${ (new Serl.Node).procMap.counter }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #4.1 : Node's procMap is writable ?` )
try { console.log ( `OK: CODE [[  
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    ]] RETURNED [[${(()=>{
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    })() }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #5 : does the Proc class / function / object exist?` )
try { console.log ( `OK: CODE [[
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    ]] RETURNED [[${
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #5.1 : how readable is the Proc's .toString()?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST #6 : what happens to procMap and its counter when processes are removed? What happens when processes are stopped?]` )

console.log ( `[TEST #3.4 : how shall we implement send/receive interaction?`)
console.error (`3.4: break this up into a series of small tests`)
    //  Code it here, then move it to serl.js
    //
    //  If fun doesn't call Serl.Proc.receive(), then fun doesn't wait, and runs till
    //  completion.
    //  If fun DOES call Serl.Proc.receive(), then fun has to AWAIT its result,
    //  which must be a Promise

try { console.log ( `OK: CODE [[  

        let n   =   new Serl.Node ('test3.4')
        let fun =   async function(){ 
            let message = await this.receive()
        }
        let pid     = n.spawn(fun)
        let proc    = n.procMap.get(pid) 

        proc.mailHandler ( 'ohai' )

    ]] RETURNED [[${(()=>{

    //  INIIALISATION of F1

        let n   =   new Serl.Node ('test3.4')
        let F1  =   async function(){                                     

            console.log (`NEWS, F1: ${this} is spawning; logging the function body
                line BEFORE this.receive()'s 1st call`) 

            let branches = [
                [   message => message == 1 ,                               // match
                    message => `match met, message == 1`                    // branch
                ],
                [   message => typeof message == 'number',                  // match
                    message => `match met, message not 1, but a number`     // branch
                ],
                [   message => typeof message == 'string',                  // match
                    message => `match met, not a number, but a string`      // branch
                ],
                [   message => typeof message == 'function',                // match
                    message => () => { return `match met, a function` }     // branch
                ],
            ]

            // TODO: nomenclature... awaited? received? = this.receive?  this.waiter?

            let awaited1     = await this.receive( branches )
            // F1 PAUSES HERE

            console.log (`NEWS, F1: ${this}; logging the function body line
                AFTER this.receive()'s 1st call`) 

            console.log (`NEWS, F1: ${this}; logging the function body
                line BEFORE this.receive()'s 2nd call`) 

            let awaited2    = await this.receive( branches )
            // F1 PAUSES HERE

            console.log (`NEWS, F1: ${this}; logging the function body line
                AFTER this.receive()'s 2nd call`) 

            console.log (`NEWS, F1: awaited1 is [[${awaited1}]] type: ${typeof
                awaited1}`)

            console.log (`NEWS, F1: awaited2 is [[${awaited2}]] type: ${typeof
                awaited1}`)


        } 
        // F1's definition ends

    //  EXECUTION of F1 in a process

        let pid     = n.spawn(F1)

        console.log (`NEWS: AFTER F1`) 
            // ... but this runs before Promise resolves...

    //  TEST: how does the process react?

        let proc    = n.procMap.get(pid) 

        console.log (`NEWS: AFTER F1, sending the message '{1:"should not match"}'...`) 
        proc.mailHandler ( {1:"should not match"} )

        console.log (`NEWS: AFTER F1, sending the message '{2:"should not match"}'...`) 
        proc.mailHandler ( {2:"should not match"} )

        console.log (proc.mailbox)

        console.log (`NEWS: AFTER F1, sending the message 'ohai'...`) 
        proc.mailHandler ( 'ohai' )

        console.log (proc.mailbox)

        // At this point, F1's awaited Promise is resolved. But proc.mailHandler
        // was not unset, so mailHandler runs again (waste of CPU) before a new
        // Promise can be attached... TODO TODO

        console.log (`NEWS: AFTER F1, sending the message '()=>{}'...`) 
        proc.mailHandler ( ()=>{} )

        console.log (proc.mailbox)

})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}
    /*  https://erlangbyexample.org/send-receive
    
    How does a process handle received messages?

    When a process receives a message, the message is
    appended to the mailbox.

    The receive block will try each message in the mailbox (one
    by one), against that block's sequence of patterns, until
    one of the messages matches a pattern.

    When there is match, the message gets removed from
    the mailbox and the logic corresponding to the matched pattern
    will get executed. If there is no match,
    then that message remains in the mailbox, and the following
    message gets tried sequentially,
    against all of the receive block's patterns.

    If no messages in the mailbox match any pattern, the process,
    having tried all messages, and having exhausted all receive
    patterns, will get suspended until a new message arrives,
    and the message processing logic starts all over,
    beginning with the first message in the mailbox.

    */



/* template test (NO-expected-error):

console.log ( `[TEST # : ?` ); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

        return x
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

*/
/* template test (expected-error):

console.log ( `[TEST # : ?` ) try { console.error ( `NO ERROR THROWN: CODE [[ 

    ]] RETURNED [[

    ]]` ) } catch (e) { console.log(`OK: CODE [[

    ]] RETURNED [[ ${( e instanceof Error) ? e : new Error ('Expected an error,
did not obtain one.')} ]]`) } finally {console.log('] - - ')}

*/
/* templace test (simply undone feature):

console.error ( `[TEST # : .]` )

*/
