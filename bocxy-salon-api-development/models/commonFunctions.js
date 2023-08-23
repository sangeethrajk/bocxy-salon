/** **************************************************************** */
/** ***** Usage: Contains common functions of models for DRY   ***** */
/** ***** Author: Loki      **************************************** */
/** **************************************************************** */

module.exports = {
  exclude: (columns, exclude) =>
    columns.filter((value, index) => !exclude.includes(value.key)),

  fieldConvert: (columns, knex) => {
    let returnArray = [];
    for (const obj of columns)
      if (obj.dateTime)
        returnArray.push(
          knex.raw(
            `DATE_FORMAT(${obj.field}, "%Y-%m-%d %H:%i:%s") AS ${obj.key}`
          )
        );
      else if (obj.date)
        returnArray.push(
          knex.raw(`DATE_FORMAT(${obj.field}, "%Y-%m-%d") AS ${obj.key}`)
        );
      else if (obj.time)
        returnArray.push(
          knex.raw(`DATE_FORMAT(${obj.field}, "%H:%i:%s") AS ${obj.key}`)
        );
      else returnArray.push(`${obj.field} AS ${obj.key}`);
    return returnArray;
  },

  // if trash parameter is true, it will return all columns to insert into trash table
  checkFields: (columns, obj, insertUpdateExclude, trash) => {
    let returnObj = {};
    let finalColumns = columns;
    if (!trash) {
      finalColumns = module.exports.exclude(columns, insertUpdateExclude);
    }
    for (let key in obj) {
      const found = finalColumns.find((x) => x.key === key);
      if (found) returnObj[found.field] = obj[key];
    }
    return returnObj;
  },
};
