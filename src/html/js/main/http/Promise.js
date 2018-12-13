/**
 * Personium
 * Copyright 2016 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global _pc:false */

/**
 * It creates a new object _pc.Promise.
 * @class Promise class to implement the concept of Promise for Async requests
 * @constructor
 */
_pc.Promise = function() {
  this.resolvedValue = null;
  this.errorMessage = null;
};

/**
 * Resolve method called when a promise transitions from unfulfilled to fulfilled state.
 * @param {String} value
 * @returns {object} value
 */
_pc.Promise.prototype.resolve = function (value) {
  this.resolvedValue = value;
  return value;// This might not be required when 'then' method will be called
};

/**
 * Reject method called when a promise transitions from unfulfilled to failed state.
 * @param {String} response object
 */
_pc.Promise.prototype.reject = function (response) {
  if(typeof response === "string"){
    this.errorMessage = response;
  }else{
    this.errorMessage = response;
  }
  //  throw new _pc.DaoException("Error occured", this.errorMessage);// This might not be required when 'then' method will be called
};

/**
 * Then method to access its current or eventual value or reason.
 * @param {Function} onResolved callback
 * @param {Function} onRejected callback
 */
_pc.Promise.prototype.then = function (onResolved, onRejected) {
  if(this.resolvedValue){
    onResolved(this.resolvedValue);
  }else if(this.errorMessage){
    onRejected(this.errorMessage);
  }
};
