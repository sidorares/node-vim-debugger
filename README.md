# !Please Read!
In node 7.7 release the api for the debugger changed and we did not yet mangage to update the plugin accordingly
In order for this plugin to work use 7.6 version of node get it [here](https://nodejs.org/dist/v7.6.0/)
If you don't want to configure nvm to work with the debugger or your affraid you could break your current setup,
just download the binary to your desktop.
```bash
~/Desktop/node-v7.6.0-darwin-x64/bin/node --debug-brk examples/qqq.js
```
If this does not work for you please consider to open an issue , join our [gitter][gitter] chatroom or talk to us on twitter and ask your question there.
We are always happy to help.


# Test Coverage

|Integration Test| Platform | User |
|---|---|---|
|Description of the Test would add a link to our wiki here | Mac OS X 10.12.6 | Anzumana |

# Contributors

|	User	|	Code	|	Docs	|	Continuous Integration | Testing | Test Coverage | 
|	---	|	---	|	---	|
|Sidorales| ||
|Joshua Appelman||
|The Gitter Badger ?||
|Josh Coffey||

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=sidorares&url=https://github.com/sidorares/node-vim-debugger&title=node-vim-debugger&language=&tags=github&category=software)

node-vim-debugger
=================
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sidorares/node-vim-debugger?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Node.js debugger client and vim driver. Step-by-step debugging from vim.

![vimdebug](https://cloud.githubusercontent.com/assets/173025/3963425/7c2322b0-277b-11e4-8bd0-506fe8f9ba8a.gif)

### install

```sh
npm install -g vimdebug
```

### usage

A debugger, agent and vim session will have to be launched. These can either all be started individually:

1) start your program with debugger enabled

```sh
node --debug-brk yourprogram.js
```

2) start agent

```sh
node-vim-inspector
```

3) connect vim to agent:

```sh
vim -nb
# or if you have vim already running, type `:nbs` in command mode
```

Alternatively, launch `node-vim-inspector` with a path to your script to do step 1&2 at once:

```sh
node-vim-inspector yourprogram.js
```

Or even give it the name of the window manager you're using for it to also launch a new vim session. Currently supported WMs are tmux and i3.

```sh
node-vim-inspector --windowmanager=tmux yourprogram.js
# or:
node --debug-brk yourprogram.js
node-vim-inspector --windowmanager=tmux
```

to run all inside vim using [ConqueShell](https://github.com/lrvick/Conque-Shell) (+coffeescript support) see [here](https://gist.github.com/coderofsalvation/0aabf454888b8e5da213)

### keys

  - <kbd>CTRL</kbd>+<kbd>c</kbd> - continue
  - <kbd>CTRL</kbd>+<kbd>i</kbd> - step in
  - <kbd>CTRL</kbd>+<kbd>o</kbd> - step over
  - <kbd>CTRL</kbd>+<kbd>n</kbd> - step next
  - <kbd>CTRL</kbd>+<kbd>u</kbd> - move one stack frame up
  - <kbd>CTRL</kbd>+<kbd>d</kbd> - move one stack frame down
  - <kbd>CTRL</kbd>+<kbd>p</kbd> - set breakpoint at current location

## configuration

The default configuration is as follows:

```json
{
  "vim": {
    "keys": {
      "break"    : "C-p",
      "continue" : "C-c",
      "down"     : "C-d",
      "in"       : "C-i",
      "next"     : "C-n",
      "out"      : "C-o",
      "up"       : "C-u"
    }
  },
  "agent": {
    "port": 3219
  },
  "debugger": {
    "port": 5858
  },
  "windowmanager": ""
}
```

Any of these settings can be overridden either from the command line, e.g. `--vim.keys.break="C-b"`, a `.vimdebugrc` json file selectively overriding properties or environment variables in the form of `export vimdebug_vim__keys__break="C-a"`.

The `.vimdebugrc` can be placed either in the current working directory, any directory above the current or the current user's home directory. In case there are multiple they will override each other in this order.

## agent

Settings for the vim-debug netbeans agent.

### agent.port

Port the agent uses to establish a connection.

## debugger

Settings for the spawn debugger. Only relevant when the debugger spawn from the `node-vim-inspector` client, e.g. it is called with the path of a NodeJS program to debug.

### debugger.port

Port to spawn the debugger on.

## vim

Settings used by the vim client.

### vim.keys

Key mappings inside vim to manipulate the debugger.

#### vim.keys.break

Add a breakpoint at current line and column.

#### vim.keys.continue

Resume program execution until the next breakpoint is encountered, or the program terminates.

#### vim.keys.down

Move down one stack frame.

#### vim.keys.in

Step inside the current statement's execution.

#### vim.keys.next

Step to the next statement.

#### vim.keys.out

Step out of the current statement.

#### vim.keys.up

Move up one stack frame.

### Links

  - [V8 Debugger protocol wire format](https://code.google.com/p/v8/wiki/DebuggerProtocol)
  - [debugger documentation (deprecated)](http://nodejs.org/api/debugger.html)
  - [node-inspector](https://github.com/node-inspector/node-inspector)
  - [webkit-agent](https://github.com/c4milo/node-webkit-agent)
  - [node-cli-debugger](https://github.com/sidorares/node-cli-debugger)
  - [debugger protocol node client](https://github.com/sidorares/v8-debugger-protocol)
  - [node-vim](https://github.com/moll/vim-node) - node-related vim scripts
  - ['readline-vim'](https://github.com/thlorenz/readline-vim) - vim keybindings for node readline
  - [ndb](https://github.com/smtlaissezfaire/ndb)
  - [node-profiler](https://github.com/bnoordhuis/node-profiler)
  - [v8.log processor](https://github.com/sidorares/node-tick)

[gitter]: https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sidorares/node-vim-debugger?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
