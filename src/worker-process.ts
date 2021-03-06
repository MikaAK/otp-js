import {log} from 'helpers'
import {expose} from 'comlink'

import {PID} from './pid'
import {RegistryFetchProcessPortFn} from './process-registry'

export type ProcessSendMessageFunction<T> = (pid: PID, data: T) => void
export type ProcessSendMainMessageFunction<T> = (data: T) => void

export type ProcessMessageFunction<T> = (
  data: T,
  send?: ProcessSendMessageFunction<T>,
  sendMain?: ProcessSendMainMessageFunction<T>
) => void

export class WorkerProcess<T> {
  private _pid: PID
  private _port: MessagePort
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
    this._port = port
    this._getPortByPid = getPortByPid

    port.onmessage = ({data}: {data: T}) => {
      log(`WorkerProcess ${pid}`, data)

      processMessage(
        data,
        (pid, data) => this.sendMessage(pid, data),
        (data) => port.postMessage(data)
      )
    }
  }

  public handleMessage(data: T) {
    this._processMessage(
      data,
      (pid, data) => this.sendMessage(pid, data),
      (data) => this._port.postMessage(data)
    )
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
