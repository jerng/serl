import * as Serl from '../lib/serl.js'

class Exam {

    constructor ( data ) {
       
        let testCount   = 0
        let passCount   = 0
        let warnCount   = 0
        let concerns    = []

        console.log (
`
**
*   (new Exam)!
*   Number of concerns : ${data.concerns.length}
*   ... commencing...
**`)

        console.group/*Collapsed*/ ( 'Concerns (toggle expansion)' )

        for ( const i in data.concerns ) {

            let exec = ( fulfill, reject ) => {
                if ( data.concerns[i].warning ) {

                    A_WARNING_NOT_A_TEST:
                    {
                        warnCount ++

                        fulfill ( Object.assign ( {},
                            data.concerns[i],
                            {   render : () => {
                                    console.group   ( `Warning: #${ warnCount }` )
                                    console.warn    ( data.concerns[i].warning )
                                    console.groupEnd()
                                }
                            }
                        ) )

                    }

                } 
                fulfill ( { render : () => { console.log('not a warning') } } )

            } // exec

            let concernPromise = new Promise ( exec )
            concerns.push ( concernPromise )

/*            
            if ( data.concerns[i].warning ) {

                A_WARNING_NOT_A_TEST:
                {
                    warnCount ++

                    console.group   ( `Warning: #${ warnCount }` )
                    console.warn    ( data.concerns[i].warning )
                    console.groupEnd()

                    continue 
                }

            } 
            
            // If Concern is not a Warning, then it must be a Test.

            testCount ++
            let returned

            if ( data.concerns[i].expectError ) {

                TEST_WHERE_ERROR_EXPECTED: 
                {
                    let errorThrown     = false

                    try {

                        returned        = data.concerns[i].code()

                    } catch (e) {

                        errorThrown     = true 
                        passCount ++ 

                        console.groupCollapsed  ( `Test: #${ testCount } passed (caught an Error) - ${ data.concerns[i].test }` )
                        console.log             (
`*   Caught  : ${ e }
*   Returned: ${ returned }`) 
                        {   console.groupCollapsed  ( `Code:` )
                            console.log             ( data.concerns[i].code.toString() )
                            console.groupEnd        ()
                        }
                        console.groupEnd        ()

                    } finally {
                        
                        if ( ! errorThrown ) {
                            
                            console.group   ( `Test: #${ testCount } failed (caught no Error) - ${ data.concerns[i].test }` )
                            console.error   (
`*   Returned: ${ returned }`) 
                            {   console.group   ( `Code:` )
                                console.error   ( data.concerns[i].code.toString() )
                                console.groupEnd()
                            }
                            console.groupEnd()

                        } // if ( ! errorThrown)

                    } // finally
                    
                    continue

                } // TEST_WHERE_ERROR_EXPECTED

            } // if ( data.concerns[i].expectError )


            TEST_WHERE_ERROR_NOT_EXPECTED:
            {
                try {   
                        returned = data.concerns[i].code()  

                        if ( ! 'want' in data.concerns[i] ) {
                            throw `Writers of this test did not specify what they wanted.`
                        }
                        
                        // Validation function IS expected:

                        else if (   typeof data.concerns[i].want        == 'string' 
                                &&  data.concerns[i].want.toLowerCase() == 'vfun' ) {

                            if ( ! 'vfun' in data.concerns[i] ) {
                                throw `Writers of this test did not specify the validation function.`
                            }

                            // Asynchronous test result handler:
                             // if ( returned instanceof Promise ) {
                             // 
                             //     let asyncTestHandler = async () => {
                             //         let testFulfillmentValue = await returned
                             //     }

                             //     //let onFulfilled = ( value ) => {
                             //         
                             //     //}
                             //     //prom.then ( onFulfilled, onRejected)
                             // }

                            // Synchronous test result handler:
                            if ( data.concerns[i].vfun ( returned ) != true ) {
                                throw   `We wanted the code to return a value, RV, where VFUN(RV) returns (true), given a validation function, VFUN, whose body is : 

${ data.concerns[i].vfun.toString() }`
                            }

                        } 
                        
                        // Validation function NOT expected:

                            // Asynchronous test result handler: needs to go
                            // here. FIXME
                        else if ( returned instanceof Promise) {
                            let onFulfill   = fValue    => {
                                console.log ( fValue  )
                            }
                            let onReject    = rReason   => {
                                console.log ( rReason )
                            }
                            let t = returned.then ( onFulfill, onReject )
                            console.log ( t )
                        }
                        else if ( returned != data.concerns[i].want ) {
                            
                            // implied: &&  ( 'want' in data.concern[i] )
                            // implied: &&  (       typeof data.concern[i].want         != 'string' 
                            //                  ||  data.concern[i].want.toLowerCase()  != 'vfun' 

                            throw `We wanted the code to return : ${data.concerns[i].want}`
                        }

                        passCount ++

                        console.groupCollapsed  ( `Test: #${ testCount } passed - ${ data.concerns[i].test }` )
                        console.log             ( 
`*   Returned: ${ returned }`) 
                        {   console.groupCollapsed  ( `Code:` )
                            console.log             ( data.concerns[i].code.toString() )
                            console.groupEnd        ()
                        }
                        console.groupEnd        ()

                } catch (e) {   
                   
                    console.group   ( `Test: #${ testCount } failed - ${ data.concerns[i].test }` )
                    console.error   ( 
`*   Returned: ${ returned }
*   Message : ${ e }`) 
                    {   console.group   ( `Code:` )
                        console.error   ( data.concerns[i].code.toString() )
                        console.groupEnd()
                    }
                    console.groupEnd()

                } // catch

            } // TEST_WHERE_ERROR_NOT_EXPECTED
*/
        } // for ( const i in data.concerns ) 

        console.groupEnd ( 'Concerns (toggle expansion)' )


        // After all test promises have been fulfilled, report:
        Promise.all ( concerns ).then ( fValues => {
            fValues.forEach ( ac => ac.render() )
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
        } )


    } // constructor()   

} // class Exam

new Exam ( {
    concerns : [
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
    want : 'VFUN',
    vfun : (returned) => Number.isInteger(returned) 
},
{   test : '2. Does the Pid class / function / object exist?',
    code : function () {
        return new Serl.Pid (  'placeholderNodeIndex', 'placeholderProcIndex' ) 
    },
    want : 'vfun',
    vfun : (returned) => returned instanceof Serl.Pid 
},
{   test : '2.1. Is the Pid\'s .toString() readable?',
    code : function () {
        let n = new Serl.Node ('test2.1')
        return new Serl.Pid ( 'readableNodeName', 'readableProcIndex' )
    },
    want : 'vfun',
    vfun : (r) => r.toString().includes('readable')
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
{   test : `3.3. Process is spawned, then what?`,
    code : function () {

        let exec = ( fulfill /*, reject*/ ) => {

            /*
            let n = new Serl.Node ('test3.3')
            let p = n.spawn( ()=>{

                console.log(`NEWS: test 3.3., spawn/1 was called on a function body containing this line`)
                
                fulfill ('test3.3. promise fulfillment value')
            } )
            */
            fulfill ('fulfillment value')
        }
        return new Promise ( exec ) 
    },
    want : true,
},

{   test : `4. Node's procMap is readable ?`,
    code : function () {
        (new Serl.Node).procMap.counter
    }
},

{   test : `4.1. Node's procMap is writable ?`,
    code : function () {
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    }
},
{   test : `5 : does the Proc class / function / object exist?`,
    code : function () {
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    }
},
{   test : `5.1 : how readable is the Proc's .toString()?`,
    code : function () {
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
    }
},
{   warning : `[TEST #6 : what happens to procMap and its counter when processes are removed? What happens when processes are stopped?]`,
},
{   test : `3.4 : how do processes receive messages?`,
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

    }
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
