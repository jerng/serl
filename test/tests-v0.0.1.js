import * as Serl from '../lib/serl.js'

class Exam {

    constructor ( data ) {
        
        let passCount   = 0
        let warnCount   = 0

        console.log (
`
**
*   (new Exam)!
*   Number of tests : ${data.tests.length}
*   ... commencing...
**`)
        for ( const i in data.tests ) {

            let testCount = parseInt(i) + 1
            let returned
            
            if ( data.tests[i].warning ) {
                console.error(
`
**
*   Warning : ${ data.tests[i].warning }
**`)
                warnCount ++
                continue // break
            }

            if ( data.tests[i].expectError ) {

                ERROR_EXPECTED: 
                {
                    let errorThrown     = false
                    try {

                        returned        = data.tests[i].code()

                    } catch (e) {

                        errorThrown     = true 

                        console.log(
`
*   Test    : #${ testCount } passed (caught an Error)
*   Caught  : ${ e }
*   Returned: ${ returned }
*   Concern : ${ data.tests[i].concern }
**
Code    : ${ data.tests[i].code.toString() }
`) 
                        passCount ++ 

                    } finally {
                        
                        if ( ! errorThrown ) {
                            console.error(
`
*   Test    : #${ testCount } failed (caught no Error)
*   Returned: ${ returned }
*   Concern : ${ data.tests[i].concern }
**
Code    : ${ data.tests[i].code.toString() }
`) 
                        } // if

                    } // finally

                } // ERROR_EXPECTED:

            } else { // !data.tests[i].expectError

                try {   
                        returned = data.tests[i].code()  
                        console.log(
`
*   Test    : #${ testCount } passed
*   Returned: ${ returned }
*   Concern : ${ data.tests[i].concern }
**
    Code    : ${ data.tests[i].code.toString() }
`) 
                        passCount ++

                } catch (e) {   
                    
                    console.error( 
`
*   Test    : #${ testCount } failed
*   Concern : ${ data.tests[i].concern }
*   Message : ${ e }
**
    Code    : ${ data.tests[i].code.toString() }
`) 
                } // catch

            } // if-else ( data.tests[i].expectError )

        } // for ( const i in data.tests ) 

        let testCount = data.tests.length - warnCount

        console.log (
`
**
*   ... (new Exam) constructed.
*   Number of tests             : ${testCount}
*   Number of tests passed      : ${passCount}
*   Number of tests failed -----: ${testCount - passCount}
*   Number of warnings logged   : ${warnCount}
*   
*   No further results.
**`)

    } // constructor()   

} // class Exam

new Exam ( {
    tests : [
{   concern : '1. Does the Node class / function / object exist?',
    code : function () {
        return (new Serl.Node instanceof Serl.Node)
    }
}, 
{   concern : '1.1. Do Node instances have names?',
    code : function () {
        return (new Serl.Node('tom')).name
    }
},
{   concern : '1.2. Does static method Pid.nodeIndexFromNodeName() work?',
    code : function () {
        let n = new Serl.Node ('test1.2')
        return Serl.Proc.nodeIndexFromNodeName ( n, n.name )
    }
},
{   concern : '2. Does the Pid class / function / object exist?',
    code : function () {
        return new Serl.Pid (  'placeholderNodeIndex', 'placeholderProcIndex' ) instanceof Serl.Pid
    }
},
{   concern : '2.1. How readable is the Pid\'s .toString()?',
    code : function () {
        let n = new Serl.Node ('test2.1')
        return new Serl.Pid ( 'placeholderNodeName', 'placeholderProcIndex' )
    }
},
{   concern : '3. spawn(()=>{})?',
    code : function () {
        return (new Serl.Node).spawn(()=>{})
    }
},
{   concern : '3.1. Will spawn(1) throw an error?',
    expectError : true,
    code : function () {
        return (new Serl.Node).spawn(1)
    }
},
{   concern : `
    3.2. Do successive calls to spawn() increment the Proc Pids in the Node's
    procMap?`,
    code : function () {
        let n = new Serl.Node('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
    }
},
{   warning : '[TEST #3.n : tests for arities != 1, unwritten at this time; NO DISTRIBUTED COMPUTING.]',
},
{   concern : `3.3. Process is spawned, then what?`,
    code : function () {
        let n = new Serl.Node ('test3.3')
        let p = n.spawn( ()=>{console.log(`NEWS: spawn/1 was called on a function body
        containing this line`)} )
        return p
    }
},

{   concern : `4. Node's procMap is readable ?`,
    code : function () {
        (new Serl.Node).procMap.counter
    }
},

{   concern : `4.1. Node's procMap is writable ?`,
    code : function () {
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    }
},
{   concern : `5 : does the Proc class / function / object exist?`,
    code : function () {
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    }
},
{   concern : `5.1 : how readable is the Proc's .toString()?`,
    code : function () {
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
    }
},
{   warning : `[TEST #6 : what happens to procMap and its counter when processes are removed? What happens when processes are stopped?]`,
},
{   concern : `3.4 : how do processes receive messages?`,
    code : function () {
    
    //  INIIALISATION of F1

        let n   =   new Serl.Node ('test3.4')
        let F1  =   async function(){                                     

            let view_all_3_4 =true 

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

    }
},
{   warning : `
3.4: break this up into a series of small tests
    //  Code it here, then move it to serl.js
    //
    //  If fun doesn't call Serl.Proc.receive(), then fun doesn't wait, and runs till
    //  completion.
    //  If fun DOES call Serl.Proc.receive(), then fun has to AWAIT its result,
    //  which must be a Promise
`,
},
{	warning: `[TEST #7 : process link interaction, unimplemented`
},
{	warning: `[TEST #8 : process exit signals interaction, unimplemented`
},
{	warning: `[TEST #9 : process monitoring interaction, unimplemented`
},
{	warning: `[TEST #3.4: should be made async, so that it finishes before #3.5
begins.]` 
},
{   warning : `Async test results follow after the exam report. Test framework
needs to be modified to prevent this.`,
},
{   concern : `3.5 : how do processes send messages? (includes 15k message test
site) (f1a,b,c,d,e, are mutually exclusive options for testing; you want to read
the code... f1e is the most sophisticated option`,
    code : function () {

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

            console.error ( `[TEST (above) : do your 15k test by uncommenting
            the shim, below.]` )

            let counter = 0
            while ( counter < 1 ) // shim
            //while ( counter < 15000 ) // do your 15k test here
            {
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

    }
},
{   warning : `WARNING: 3.5, here f1bNamed makes a tail-call to itself, but it
is not clear that this will not blow the call-stack; see note at f1bNamed;
check`,
},



/* Templates: 

{   concern : ``,
    code : function () {
    }
},

{   concern : ``,
    expectError : true,
    code : function () {
    }
},

{   warning : ``,
},
*/
    ]
} )
