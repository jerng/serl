# Project: Serl

Javascript/OTP, anyone? Here's an attempt to port Erlang/OTP (Open Telecom Protocol) semantics to browser-based ECMAScript.

## Project: Demo

To eyeball a very rough demo, serve the [repository
directory](https://github.com/jerng/serl), then click on the link to tests. Open
the console to see test output. Tweak the code in `tests.js` and see how it
reacts.

# Backlog

## Backlong: First items to implement:

    - DONE: `Node` class, which constructs an object based on (erl),
      representing one runtime system 'node'
    
    - DONE: `Pid` class, which constructs an object based on the Erlang 'pid'
      datatype; remember to specify its toString; maybe specify parsePid as its
      inverse

    - DONE: `node.spawn/3` method, which returns the pid of a new 'lightweight
      process' started on a 'serl' node; the await ES keyword should be used in
      place of the receive Erlang keyword; use the 'arguments' object to
      implement arity=3, such that the other arities can be structurally
      implemente later

    - DONE: `proc.send/2` method, for sending messages; since send/3 doesn't
      change the position of the first two parameters, we don't have to check
      for arity here...

    - UNDONE: then do a test using the pingpong example in Erlang docs on
      message passing

# Documentation

- Just getting started... please give me a week to improve this (2019-12-24)
- [Hosted here](https://jerng.github.io/serl/).

## Documentation: Generation

Currently using [JSDoc](https://www.npmjs.com/package/jsdoc). 
* [JSDoc Documentation](https://jsdoc.app)
* JSDoc can suck in this Markdown file.
  * a [Markdown reference](https://en.support.wordpress.com/markdown-quick-reference/)

Quick start to generating documentation from JSDoc-formatted comments in source files:

```
$ cd path/to/serl-git-repository
$ npm install --save-dev jsdoc
$ node node_modules/jsdoc/jsdoc.js lib/serl.js -d docs -c node_modules/jsdoc/conf.json -R ./README.md
```
Current configuration of `conf.json`:
```
{
    "plugins": ["plugins/markdown"],
    "markdown": {
        "tags": [
            "description"
        ]
    },
    "allowUnknownTags": true
}
```
`.vimrc` line to auto-regenerate documentation (example):
```

autocmd BufWritePost ~/exercises/serl/* !node 
    \ ~/exercises/serl/node_modules/jsdoc/jsdoc.js
    \ ~/exercises/serl/lib/serl.js
    \ -d ~/exercises/serl/docs
    \ -c ~/exercises/serl/node_modules/jsdoc/conf.json
    \ -R ~/exercises/serl/README.md
```
## Documentation: TODO

Get on [JSDoc Slack](https://jsdoc-slack.appspot.com/).

# Architecture

## Architecture: Priorities

- Leverage on the maturity of OTP design patterns.

    - If `#itjustworks` in the browser, then we're on our way to using the same
      framework on the server and client.

    - Future possibilities: inter-op with OTP compliant code written in any
      language and working on any runtime. 

- General Erlang/OTP priorities.

    - No shared memory between procs.

    - Let it crash.

    - Asynchronous coding style should allow non/minimally-blocking programs.

        - Testing protocol to ensure this for all user code should be
          established.

    - Users must be reminded to write JavaScript like this.

    - Recursion should not block the stack. `#tailcalls`

        - Utilities need to be provided to ease writing this sort of code. (See
          `Serl.recurse/2` for example.)

- Otherwise minimally opinionated.

- Back to basics. The framework should encourage weak users,and also as well as
  to allow quick-starts on tiny projects.

    - The library should run out of the box. Building should optional.

    - The library should not require DSLs. Transpilation should be
      optional. Everything should work in `use strict`.

    - Server-side rendering should be optional. When SSR is enabled, de/hydration
      should be optional.

    - Performance optimisations should generally be optional.

    - Computed properties should be optional.

# Motivations?

I didn't want to do this. I wanted something like
[this](https://github.com/jerng/justjsf#versions-current-branch), but hit a
dead-end, and fell back to the approach on this repository.
