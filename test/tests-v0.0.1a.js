import * as Serl from '../lib/serl.js'
import * as SSON from '../lib/sson/sson.js'
import * as Exam from '../lib/classes/exam.js'

new Exam.Exam ( {
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
{	warning: `[TEST #7 : process link interaction, unimplemented`
},
{	warning: `[TEST #8 : process exit signals interaction, unimplemented`
},
{	warning: `[TEST #9 : process monitoring interaction, unimplemented`
},
{	warning: `[TEST #3.4: should be made async, so that it finishes before #3.5
begins.]` 
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
