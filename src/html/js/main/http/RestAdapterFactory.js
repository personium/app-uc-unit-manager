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

///**
//* RestAdapterを生成するクラス.
//* @class Represents RestAdapterFactory.
//*/
/**
 * It creates a new object _pc.RestAdapterFactory.
 * @class This class generates RestAdapter.
 * @constructor
 */
_pc.RestAdapterFactory = function() {
};

///**
//* ResrAdapterかBatchAdapterを生成する.
//* @param accessor アクセス主体
//* @return RestAdapter
//*/
/**
 * It generate a BatchAdapter or ResrAdapter.
 * @param {_pc.Accessor} accessor object
 * @return {_pc.RestAdapter/_pc.BatchAdapter} object
 */
_pc.RestAdapterFactory.create = function(accessor) {
  if (accessor.isBatchMode()) {
    return accessor.getBatchAdapter();
  } else {
    return new _pc.RestAdapter(accessor);
  }
};

