import * as Serl from '../lib/serl.js'
import * as SSON from '../lib/sson/sson.js'
import * as Exam from '../lib/classes/exam.js'

new Exam.Exam ( {
    concerns : [
{   warning : 'TEST FRAMEWORK : Rendering probably needs to happen in a subsequent loop; currently it is done in the main loop, which results in some very bulky, messy code.' },
{   test : '1. Does the Node class / function / object exist?',
    code : function () {
        return (new Serl.Node instanceof Serl.Node)
    },
    want : true
}, 
{   test : '1.1. Do Node instances have names?',
    code : function () {
        return (new Serl.Node('tom')).name
    },
    want : 'vfun', 
    vfun : (returned) => returned.includes('tom')
},
{   test : '1.2. Does static method Pid.nodeIndexFromNodeName() work?',
    code : function () {
        let n = new Serl.Node ('test1.2')
        return Serl.Proc.nodeIndexFromNodeName ( n, n.name )
    },
    want : 'vfun',
    vfun : (returned) => Number.isInteger(returned) 
},
{   test : '2. Does the Pid class / function / object exist?',
    code : function () {
        return new Serl.Pid (  'placeholderNodeIndex', 'placeholderProcIndex' ) 
    },
    want : 'vfun',
    vfun : (returned) => returned instanceof Serl.Pid 
},
{   test : '2.1. Is the Pid\'s .toString() legible?',
    code : function () {
        let n = new Serl.Node ('test2.1')
        return new Serl.Pid ( 'readableNodeName', 'readableProcIndex' )
    },
    want : 'legible'
},
{   test : '3. Will spawn()-ing an empty function return a Pid object ?',
    code : function () {
        return (new Serl.Node).spawn(()=>{})
    }, 
    want : 'vfun',
    vfun : (r) => r instanceof Serl.Pid
},
{   test : '3.1. Will spawn(1) throw an error?',
    expectError : true,
    code : function () {
        return (new Serl.Node).spawn(1)
    }
},
{   test : `
    3.2. Do successive calls to spawn() increment the Proc Pids in the Node's procMap?`,
    code : function () {
        let n = new Serl.Node('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
    },
    want : 'vfun',
    vfun : r => r[0] < r[1]
},
{   warning : '[TEST #3.n : tests for arities != 1, unwritten at this time; NO DISTRIBUTED COMPUTING.]',
},
{   test : `3.3. Process is spawned, does its function body execute?`,
    code : function () {

        let exec = ( fulfill , reject ) => {

            globalThis.executionToggle = false
            let n = new Serl.Node ('test3.3')
            let p = n.spawn( ()=>{

                console.log(`NEWS: test 3.3., spawn/1 was called on a function body containing this line`)
                globalThis.executionToggle = true 
            } )
            fulfill ( globalThis.executionToggle )

        }

        return new Promise ( exec ) 
    },
    want : true,
},
{   test : `4. Node's procMap is legible ?`,
    code : function () {
        return (new Serl.Node).procMap.counter
    },
    want : 'legible'
},
{   test : `4.1. Node's procMap is writable ?`,
    code : function () {
        let n = (new Serl.Node)
        let initial = n.procMap.counter
        n.procMap.counter += 1
        return n.procMap.counter === initial
    },
    want : false
},
{   test : `5 : does the Proc class / function / object exist?`,
    code : function () {
        return new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) 
                instanceof Serl.Proc
    },
    want : true
},
{   test : `5.1 : how readable is the Proc's .toString()?`,
    code : function () {
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
    },
    want : 'legible'

},
{   warning : `[TEST #6 : what happens to procMap and its counter when processes are removed? What happens when processes are stopped?]`,
},
{   test : `3.4 : how do processes receive messages?`,
    code : function () {

        let returnedPromise = new Promise ( ( fulfill, reject ) => {

            //  INIIALISATION of F1

            let n   =   new Serl.Node ('test3.4')
            let F1  =   async function(){

                let view_all_3_4 = true // comment toggler
                let branches

                console.groupCollapsed ('3.4.2. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this} is spawning; logging the function body
                        line BEFORE this.receive()'s 1st call`) 

                    branches = [
                        [   message => message == 1 ,                               // guard
                            message => `guard passed, message == 1`                    // path
                        ],
                        [   message => typeof message == 'number',                  // guard
                            message => `guard passed, message not 1, but a number`     // path
                        ],
                        [   message => typeof message == 'string',                  // guard
                            message => `guard passed, not a number, but a string`      // path
                        ],
                        [   message => typeof message == 'function',                // guard
                            message => () => { return `guard passed, a function` }     // path
                        ],
                    ]

                    // TODO: nomenclature... awaited? received? = this.receive?  this.waiter?
                }
                console.groupEnd ('3.4.2. F1() body')

                let awaited1     = await this.receive( branches )
                // F1 PAUSES HERE

                console.groupCollapsed ('3.4.3. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the
                        function body line AFTER this.receive()'s 1st call`) 
                    view_all_3_4 && console.log (`NEWS-3.4, F1: awaited1 is [[${awaited1}]] type: ${typeof
                        awaited1}`)
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body
                        line BEFORE this.receive()'s 2nd call`) 
                }
                console.groupEnd ('3.4.3. F1() body')

                let awaited2    = await this.receive( branches )
                // F1 PAUSES HERE

                console.group ('3.4.4. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body line
                        AFTER this.receive()'s 2nd call`) 
                    view_all_3_4 && console.log (`NEWS-3.4, F1: awaited2 is [[${awaited2}]] type: ${typeof
                        awaited2}`)
                }
                console.groupEnd  ('3.4.4. F1() body')

                // store test results
                globalThis.TEST_3_4     = [ this.mailbox, awaited1, awaited2 ]

            } 
            // F1's definition ends

            console.groupCollapsed ('3.4.1. spawn(F1) :')
            {
            //  EXECUTION of F1 in a process

                let pid     = n.spawn(F1)
                
                // at this point, 
                //  'let awaited1 = await this.receive(branches)
                //  proc.mailHandler has been customised by proc.receive; end 3.4.2.
                //  F1's execution context is pushed onto the stack, with control returning to
                //  this line ->>

                console.log (`NEWS-3.4: AFTER F1`) 

            //  TEST: how does the process react?

                let proc    = n.procMap.get(pid) 
                let m1      = {1:"should not match"}
                let m2      = {2:"should not match"}
                
                proc.mailHandler ( m1 ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '${m1}'...`) 

                proc.mailHandler ( m2 ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '${m2}'...`) 

                proc.mailHandler ( 'ohai' ) // User should never send messages like this.

                //  The customised mailHandler lets 'ohai' pass,
                //  proc.mailHandler is reset to defaultMailHandler;
                //  and proc.(default)mailHandler stores the message ()=>{}
                //
                //  then, F1's execution is paused, with control passed to : 
                //  'let awaited2 = await this.receive(branches)
                //
                //  proc.mailHandler SHOULD HAVE been customised by proc.receive
                // 

                    console.log (`NEWS-3.4: AFTER F1, sending the message 'ohai'...`) 

                proc.mailHandler ( ()=>{} ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '()=>{}'...`) 

                // Initial synchronous run through concerns, ended here.
                //  then F1's execution context is popped,  and control is returned to it; 
                // -->> start 3.4.3. 

            }
            console.groupEnd ('3.4.1. spawn(F1) :')
            
            // In the future, get the test results and fulfill the promise
            setTimeout ( ()=>{ 
                    fulfill ( JSON.stringify ( globalThis.TEST_3_4 , SSON.replacer, 2) ) 
                }, 
                1000 
            )

        } ) // new Promise
        return returnedPromise
    },
    want : JSON.stringify ( 
        [   [   {1:"should not match"},
                {2:"should not match"}
            ],
            `guard passed, not a number, but a string`,
            () => { return `guard passed, a function` }
        ],
        SSON.replacer, 2 )
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
{   test : `3.5 : how do processes send messages? (includes 15k message test
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

    },
    want : 'legible'
},
{   warning : `3.4. Do your 15k test by uncommenting the relevant shim.`,
},
{   warning : `3.5, here f1bNamed makes a tail-call to itself, but it
is not clear that this will not blow the call-stack; see note at f1bNamed;
check`,
},



/* Templates: 

{   test : ``,
    code : function () {
    }
},

{   test : ``,
    expectError : true,
    code : function () {
    }
},

{   warning : ``,
},
*/
    ]
} )
