import { simplifyOrder } from "./general";

/**
 * Method to get Date object from date string in dd/mm/yyyy format
 * @param dateString - The base date string in dd/mm/yyyy format
 * 
 * @returns {Date} A Date object
 */
export const getDate = (dateString) => {
  const [day, month, year] = dateString.split("/");

  const dateObj = new Date(Number(year), Number(month)-1, Number(day));

  return dateObj;
}

export const dateCompare = (date1, date2, considerTime = false) => {
  const _date1 = new Date(date1.getTime());
  const _date2 = new Date(date2.getTime());

  if (!considerTime) {
    _date1.setHours(0,0,0,0);
    _date2.setHours(0,0,0,0);
  }

  return simplifyOrder(_date1.getTime(), _date2.getTime());
}