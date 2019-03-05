import {proxy} from 'comlink'

import {WorkerProcess} from './worker-process'

export const createWorkerProcess = <T>() =>
  proxy<WorkerProcess<T>>(new Worker('./worker-process.ts'))
