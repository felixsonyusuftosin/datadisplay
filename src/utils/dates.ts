import moment from 'moment'

export const formatDate = (date: Date, s = '/') =>
  moment(new Date(date)).format(`MM${s}DD${s}YYYY`)
export const formatDateObject = (date: Date) =>
  moment(date).format('MM-DD-YYYY')
export const getFirstDayOfMonth = (
  date = new Date(),
  month = date.getMonth()
) => new Date(date.getFullYear(), month, 1)
export const getLastDayOfMonth = (date = new Date(), month = date.getMonth()) =>
  new Date(date.getFullYear(), month + 1, 0)
export const getFirstDayOfYear = (date = new Date()) =>
  new Date(date.getFullYear(), 0, 1)
export const getLastYear = (date = new Date()) =>
  new Date(date.setFullYear(date.getFullYear() - 1))
export const getWordDate = (date = new Date()) =>
  moment(date).format('DD/MMM/YY')
export const formatDateDayMonthYear = (date: Date) =>
  moment(date).format('MM/DD/YYYY')
