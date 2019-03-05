import {log} from 'helpers'
import {expose} from 'comlink'

import {PID} from './pid'
import {RegistryFetchProcessPortFn} from './process-registry'

export type ProcessSendMessageFunction<T> = (pid: PID, data: T) => void
export type ProcessMessageFunction<T> = (
  data: T,
  send: ProcessSendMessageFunction<T>
) => void

export class WorkerProcess<T> {
  private _pid: PID
  private _processMessage: ProcessMessageFunction<T>
  private _getPortByPid: RegistryFetchProcessPortFn

  public setup(
    pid: PID,
    getPortByPid: RegistryFetchProcessPortFn,
    port: MessagePort,
    processMessage: ProcessMessageFunction<T>
  ) {
    this._processMessage = processMessage
    this._pid = pid
    this._getPortByPid = getPortByPid

    port.onmessage = ({data}: any) => {
      log(`WorkerProcess ${pid}`, data)

      processMessage(data, getPortByPid)
    }
  }

  public handleMessage(data: T) {
    this._processMessage(data, (pid, data) => this.sendMessage(pid, data))
  }

  public sendMessage<T>(pid: PID, data: T) {
    const port = this._getPortByPid(pid)

    if (port)
      port.postMessage(data)
    else
      log(`WorkerProcess ${pid}`, 'PID not found')
  }

  public pid(): PID {
    return this._pid
  }
}

expose(WorkerProcess, self)
