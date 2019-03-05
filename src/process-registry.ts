import {PID} from './pid'
import {Process} from './process'

const processRegistry = new Map<PID, Process<any>>()

export const getRegistryProcess = (pid: PID) => processRegistry.get(pid)
export const setRegistryProcess = (pid: PID, process: Process<any>) =>
  processRegistry.set(pid, process)

export const getAllRegistryProcesses = () => Array.from(processRegistry.values())

export const getRegistryProcessPort = (pid: PID) => {
  const registry = processRegistry.get(pid)

  if (registry)
    return registry.port()
}

export type RegistryFetchProcessPortFn = (pid: PID) => MessagePort | undefined
