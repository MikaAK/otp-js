export const log = (codeSection: string, message: any) => {
  console.log(codeSection, message)
}

export const debug = (codeSection: string, message: any) => {
  console.debug(codeSection, message)
}

export const error = (codeSection: string, message: any) => {
  console.error(codeSection, message)
}
