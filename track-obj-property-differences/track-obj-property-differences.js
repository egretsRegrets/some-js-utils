import deepEqual from 'deep-equal';

/**
 * create/assign returned fn to track objects and compare by property values
 * each object passed to the returned function will be tracked and compared with all other objects passed to it
 * @returns {Function} compareAndTrackObj()
 */
export function trackObjPropertyDifferences() {
  const trackedObjects = [];
  /**
   * track param trackedObj by param objId and compare property values with all other tracked objects
   * @param {Object} objId {String} arbitrary object id, should be unique for each object
   * @param {Object} trackedObj {Object} object to be tracked and compared
   * @return {Object} trackedObjects {Array<{objId: String, trackedObj: {Object}}>} all tracked objects with their id
   * @return {Object} majorityPropVals a run down of all tracked properties and their majority values
   * @return {Object} majorityPropVals.val the most common (majority) value for the property
   * @return {Object} majorityPropVals.count {Number} the number of tracked objects with this property/value pair
   * @return {Object} majorityPropVals.objectsWithPropVal {Array<String>} a list of all the object ids of tracked objects with this property/value pair
   * @return {Object} variance {Object} all of the tracked objects with prop/val pairs that are not identical to the majority prop/val pairs
   * @return {Object} variance[objId][variantPropName] {Object} the value of an information about a property with a variant value belonging to a tracked object
   * @return {Object} variance[objId][variantPropName].val the value of the prop for this tracked object
   * @return {Object} variance[objId][variantPropName].count {Number} the number of tracked objects that have this prop/val pair
   * @return {Object} variance[objId][variantPropName].objectsWithPropVal {Array<String>} a list of all the object ids of tracked objects with this property/value pair
   */

  return function compareAndTrackObj({ objId, trackedObj }) {
    trackedObjects.push({
      objId,
      trackedObj,
    });
    if (trackedObjects.length === 1) {
      return {
        trackedObjects,
        majorityPropVals: Object.entries(trackedObj).reduce(
          (majorityObj, [key, val]) => ({
            ...majorityObj,
            [key]: {
              val,
              count: 1,
              objectsWithPropVal: [objId],
            },
          }),
          {}
        ),
        variance: null,
      };
    } else {
      const propValTotals = trackedObjects.reduce(
        (propValCounts, trackedObjInfo) => {
          Object.entries(trackedObjInfo.trackedObj).forEach(([key, val]) => {
            if (Object.prototype.hasOwnProperty.call(propValCounts, key)) {
              const propVals = propValCounts[key].map(
                (propInfo) => propInfo.val
              );
              const indexOfNewValInPropValInfo = propVals.findIndex(
                (existingVal) => deepEqual(existingVal, val)
              );
              if (indexOfNewValInPropValInfo !== -1) {
                propValCounts[key][indexOfNewValInPropValInfo].count += 1;
                propValCounts[key][
                  indexOfNewValInPropValInfo
                ].objectsWithVal.push(trackedObjInfo.objId);
              } else {
                propValCounts[key].push({
                  val,
                  count: 1,
                  objectsWithVal: [trackedObjInfo.objId],
                });
              }
            } else {
              propValCounts[key] = [
                {
                  val,
                  count: 1,
                  objectsWithVal: [trackedObjInfo.objId],
                },
              ];
            }
          });
          return propValCounts;
        },
        {}
      );

      let majorityPropVals = {};
      let variance = {};

      Object.entries(propValTotals).forEach(([prop, propCountInfo]) => {
        const mostCommonValInfo = propCountInfo.sort(
          (valInfoA, valInfoB) => valInfoB.count - valInfoA.count
        )[0];
        if (mostCommonValInfo.count !== 1) {
          majorityPropVals = {
            ...majorityPropVals,
            [prop]: mostCommonValInfo,
          };
        }

        propCountInfo
          .filter((info) =>
            mostCommonValInfo.count !== 1 ? info !== mostCommonValInfo : true
          )
          .forEach((valInfo) => {
            valInfo.objectsWithVal.forEach((objId) => {
              if (Object.prototype.hasOwnProperty.call(variance, objId)) {
                variance[objId][prop] = valInfo;
              } else {
                variance[objId] = {
                  [prop]: valInfo,
                };
              }
            });
          });
      });

      return {
        trackedObjects,
        majorityPropVals,
        variance,
      };
    }
  };
}
