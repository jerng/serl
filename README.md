# Project: Serl
An attempt to port Erlang/OTP semantics to browser-based ECMAScript.

## Project: Demo

To eyeball a very rough demo, serve the [repository
directory](https://github.com/jerng/serl), then click on the link to tests. Open
the console to see test output. Tweak the code in `tests.js` and see how it
reacts.

# TODO: Priorities

## First items to implement:

    - DONE: 'Serl' class, which constructs an object based on (erl),
      representing one runtime system 'node'
    
    - DONE: 'Pid' class, which constructs an object based on the Erlang 'pid'
      datatype; remember to specify its toString; maybe specify parsePid as its
      inverse

    - DONE: Serl.spawn/3 method, which returns the pid of a new 'lightweight
      process' started on a 'serl' node; the await ES keyword should be used in
      place of the receive Erlang keyword; use the 'arguments' object to
      implement arity=3, such that the other arities can be structurally
      implemente later

    - DONE: Serl.send/2 method, for sending messages; since send/3 doesn't
      change the position of the first two parameters, we don't have to check
      for arity here...

    - UNDONE: then do a test using the pingpong example in Erlang docs on
      message passing

## Documentation

JSDoc output is [hosted here](https://jerng.github.io/serl/).

## Documentation: Generation

Currently using [JSDoc](https://www.npmjs.com/package/jsdoc). 
* [JSDoc Documentation](https://jsdoc.app)
* JSDoc can suck in this Markdown file.
  * a [Markdown reference](https://en.support.wordpress.com/markdown-quick-reference/)

Quick start to generating documentation from JSDoc-formatted comments in source files:

```
$ cd path/to/serl-git-repository
$ npm install --save-dev jsdoc
$ node node_modules/jsdoc/jsdoc.js . -c node_modules/jsdoc/conf.json -d docs  -R ./README.md
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

### Documentation: TODO

Get on [JSDoc Slack](https://jsdoc-slack.appspot.com/).

# Motivations?

I didn't want to do this. I wanted something like
[this](https://github.com/jerng/justjsf#versions-current-branch), but hit a
dead-end, and fell back to the approach on this repository.
