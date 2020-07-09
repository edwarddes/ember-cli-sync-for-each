import { typeOf } from '@ember/utils';
import Promise from 'rsvp';

var syncForEach = function(enumerable, callback, force, index){
  index = typeOf(index) === 'undefined' ? 0 : index;
  force = typeOf(force) === 'undefined' ? false : force;

  var array = enumerable.get('content') || enumerable;

  return new Promise(function(resolve, reject) {
    if (index < array.length) {

      var result = callback.call(this, array[index], index, array);

      if (result && typeOf(result['then']) === 'function') {

        if (force) {
          result.then(null,reject).finally(function() {
            syncForEach(enumerable, callback, force, ++index).then(resolve, reject);
          });
        } else {
          result.then( function() {
            syncForEach(enumerable, callback, force, ++index).then(resolve, reject);
          }, reject);
        }
      } else {

        syncForEach(enumerable, callback,force,  ++index).then(resolve, reject);
      }

    } else {

      resolve(enumerable);
    }
  });
};

export default syncForEach;
