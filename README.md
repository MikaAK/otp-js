OTP JS
===

***Currently a work in progress***

OTP js is an attempt to bring worker managment in the same style of Elixir/Erlang otp


### Setup

```javascript
import {Process} from 'otp-js'

const noop = () => null

const firstProcessHandler = (data, sendMessage) => {
  sendMessage(secondProcessPid, someExpensiveDataStuff(data))
}

const firstProcessPid = Process.create(firstProcessHandler, noop)

const secondProcessHandler = (processedData, _sendMessage, sendMainWindowMessage) =>
  sendMainWindowMessage(moreExpensiveProcessing(processedData)),

const secondMainProcessHandler = (data) => displayDataOrSomething(data)

const secondProcessPid = Process.create(
  secondProcessHandler,
  secondMainProcessHandler
)
```
