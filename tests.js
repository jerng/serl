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

console.log ( `[TEST #3.4 : how do processes receive messages?`)
console.error (`3.4: break this up into a series of small tests`)
    //  Code it here, then move it to serl.js
    //
    //  If fun doesn't call Serl.Proc.receive(), then fun doesn't wait, and runs till
    //  completion.
    //  If fun DOES call Serl.Proc.receive(), then fun has to AWAIT its result,
    //  which must be a Promise

let view_all_3_4 = false
try { console.log ( `OK: CODE [[  

    (sorry, for now: it's pretty long, so best you look in the source)

    ]] RETURNED [[${(()=>{

    //  INIIALISATION of F1

        let n   =   new Serl.Node ('test3.4')
        let F1  =   async function(){                                     

            console.log (`NEWS-3.4, F1: ${this} is spawning; logging the function body
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

            view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the
                function body line AFTER this.receive()'s 1st call`) 
            view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body
                line BEFORE this.receive()'s 2nd call`) 

            let awaited2    = await this.receive( branches )
            // F1 PAUSES HERE

            view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body line
                AFTER this.receive()'s 2nd call`) 
            view_all_3_4 && console.log (`NEWS-3.4, F1: awaited1 is [[${awaited1}]] type: ${typeof
                awaited1}`)
            view_all_3_4 && console.log (`NEWS-3.4, F1: awaited2 is [[${awaited2}]] type: ${typeof
                awaited2}`)


        } 
        // F1's definition ends

    //  EXECUTION of F1 in a process

        let pid     = n.spawn(F1)
        console.log (`NEWS-3.4: AFTER F1`) 
            // ... but this runs before Promise resolves...

    //  TEST: how does the process react?

        let proc    = n.procMap.get(pid) 

        console.log (`NEWS-3.4: AFTER F1, sending the message '{1:"should not match"}'...`) 
        proc.mailHandler ( {1:"should not match"} )
            // User should never send messages like this.

        console.log (`NEWS-3.4: AFTER F1, sending the message '{2:"should not match"}'...`) 
        proc.mailHandler ( {2:"should not match"} )
            // User should never send messages like this.
        console.log (proc.mailbox)

        console.log (`NEWS-3.4: AFTER F1, sending the message 'ohai'...`) 
        proc.mailHandler ( 'ohai' )
            // User should never send messages like this.
        console.log (proc.mailbox)

        console.log (`NEWS-3.4: AFTER F1, sending the message '()=>{}'...`) 
        proc.mailHandler ( ()=>{} )
            // User should never send messages like this.
        console.log (proc.mailbox)

})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST #7 : process link interaction, unimplemented`)
console.error ( `[TEST #8 : process exit signals interaction, unimplemented`)
console.error ( `[TEST #9 : process monitoring interaction, unimplemented`)

console.log ( `[TEST #3.5 : how do processes send messages? (includes 15k
message test site) (f1a,b,c,d,e, are mutually exclusive options for testing; you
want to read the code... f1e is the most sophisticated option`); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

        let n       =   new Serl.Node ('test3.5')

        // f1a is a non-recursing listener that will end after being matched to its
        // first message.
        let f1a      =   async function (){
            let awaited1a    = await this.receive([
                [   ()=>true, 
                        // simplest blind guard, until we improve Proc.receive
                        // TODO
                    m => m
                        // identity function
                ]               
            ])
            console.log ( `NEWS-3.5, f1a body, (awaited1a) value: [[${awaited1a}]],
                type: [[${typeof awaited1a}]]` ) 
        }

        // f1b is a recursing variation of f1a - which will match a message and
        // then reset itself to match another message.
        let f1b      =   async function (){

            let f1bNamed   =   async function (){ 
                //  'async'     required for 'await'
                //  'function'  required for 'this'

                this_block_can_be_lifted_1: {
                let awaited1b    = await this.receive([
                    [   ()=>true, 
                            // simplest blind guard, until we improve Proc.receive
                            // TODO
                        m => m
                            // identity function
                    ]               
                ])
                console.log ( `NEWS-3.5, f1bNamed body, (awaited1b) value:
                    [[${awaited1b}]], type: [[${typeof awaited1b}]]` ) 
                }
       
                f1bNamed.call (this) // recursion
                    // Tests indicate this does not blow the stack.

            } // f1bNamed

            f1bNamed.call ( this ) // Initiating call to recursive function.
        } // f1b

        // f1d is a minimally modified version of f1b
        let f1d      =   async function (){
            let f1dNamed   =   async ( proc ) => { 
                let awaited1d    = await proc.receive([
                    [ ()=>true, m => m ]               
                ])
                console.log ( `NEWS-3.5, f1dNamed body, (awaited1d) value:
                    [[${awaited1d}]], type: [[${typeof awaited1d}]]` ) 
                f1dNamed ( proc ) 
            } 
            f1dNamed ( this ) 
        } // f1d

        //  f1c is a structurally modified version of f1d
        //  

        let f1c = async function ( ) {
            // 'function'   in expression needed, for 'this' in body
            // 'async'      in expression needed, for 'await' in body
            let awaited1c    = await this.receive([
                [ ()=>true, m => m ]               
            ])
            console.log ( `NEWS-3.5, f1e body, (awaited1c) value:
                [[${awaited1c}]], type: [[${typeof awaited1c}]]` ) 
        }

        // f1e uses the same technique as f1c, demonstrated the abiliy to pass
        // arguments to the recursed proc-fun.
        let f1e = async function ( ) {
            // 'function'   in expression needed, for 'this', 'arguments'
            // 'async'      in expression needed, for 'await' in body
            let awaited1e    = await this.receive([
                [ ()=>true, m => m ]               
            ])
            console.log ( `NEWS-3.5, f1e body, (awaited1e) value:
                [[${awaited1e}]], type: [[${typeof awaited1e}]]; arguments
                passed to f1e are: [[${arguments[0]}]], [[${arguments[1]}]]` ) 
        }

        let f2      =   async function ( recipientPid ){
            console.log ( `NEWS-3.5, f2 body, row before this.send()`)
            this.send ( recipientPid, 'ohai' )
            this.send ( recipientPid, 'ohai again' )

            let counter = 0
            while ( counter < 15000 ) { // do your 15k test here
                counter ++
                this.send ( recipientPid, 'ohai' + counter )
            }
        }


// f1a, f1b, f1c, f1d, f1e, are mutually exclusive options for testing

        //let mod1    =   { recurse: recurse }
        
        //let pid1    =   n.spawn ( f1b )
        //let pid1    =   n.spawn ( f1d )
        //let pid1    =   n.spawn ( mod1, 'recurse', [f1c] )
        //let pid1    =   n.spawn ( mod1, 'recurse', [f1e, ['bill','bob']] )
        
        let pid1    =   n.spawn ( Serl, 'recurse', [f1e, ['bill','bob']] )

        let mod2    =   { f2: f2 }
        let pid2    =   n.spawn ( mod2, 'f2', [pid1] )

        //let proc1   =   n.procMap.get(pid1) 
        //let proc2   =   n.procMap.get(pid2) 
       
        //proc1.mailHandler ( 'ohai' )
            // User should never send messages like this.

        return 'placeholder'

})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}
console.error (`WARNING: 3.5, here f1bNamed makes a tail-call to itself, but it is
not clear that this will not blow the call-stack; see note at f1bNamed; check`)




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
