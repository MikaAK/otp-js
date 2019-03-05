import * as uuid from 'uuid/v5'
import {ProxyResult, proxyValue} from 'comlink'

import {log} from 'helpers'

import {PID} from './pid'
import {WorkerProcess, ProcessMessageFunction} from './worker-process'
import {createWorkerProcess} from './create-worker-process'

import {
  getRegistryProcess, setRegistryProcess,
  getAllRegistryProcesses, getRegistryProcessPort
} from './process-registry'

const PID_NAMESPACE = 'otpjs-pid'

export const createPID = (areaSpecific = 'None') => uuid(PID_NAMESPACE, areaSpecific)

export class Process<T> {
  public static find(pid: PID) {
    return getRegistryProcess(pid)
  }

  public static all() {
    return getAllRegistryProcesses()
  }

  public static create<T>(processMessage: ProcessMessageFunction<T>) {
    const process = new Process<T>(processMessage)

    setRegistryProcess(process.pid(), process)

    return process
  }

  public static sendMessage<T>(pid: PID, data: T) {
    const process = getRegistryProcess(pid)

    if (process)
      process.handleMessage(data)
    else
      log(`Process ${pid}`, 'PID not found')
  }

  private _pid: PID = Symbol(createPID())
  private _worker: ProxyResult<WorkerProcess<T>>
  private _receivePort: MessagePort

  constructor(processMessage: ProcessMessageFunction<T>) {
    const channel = new MessageChannel()

    this._receivePort = channel.port1
    this._worker = createWorkerProcess()

    this._worker.setup(
      this._pid,
      proxyValue(getRegistryProcessPort),
      channel.port2,
      processMessage
    )
  }

  public handleMessage(data: T) {
    this._worker.handleMessage(data)
  }

  public port() {
    return this._receivePort
  }

  public pid() {
    return this._pid
  }
}
