/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deep-restful/lib/collection", "jstorage/jstorage.min"],function (require, deep)
{
	deep.jstorage = deep.jstorage || {};
	/**
	 * deep.jstorage.Collection
	 * @param  {[type]} protocol                 (optional)[description]
	 * @param  {[type]} collection                (optional)[description]
	 * @param  {[type]} schema                    (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	deep.jstorage.Collection = deep.Classes(deep.Collection,
	function(protocol, collection, schema, options){
		options = options || {};
		var path = options.path || protocol;
		if(!path)
			throw deep.errors.Store("jstorage.Collection need a path at constructor. please provide a options.path or a protocol.");
		this.path = path;
		var current = collection || this.collection || $.jStorage.get(path);
		if(!current)
		{
			current = [];
			$.jStorage.set(path, current, options);
		}
		this.collection = current;
		deep.up(this, options);
	},
	{
		flush:deep.compose.after(function(opt){
			this.collection = [];
			$.jStorage.set(this.path || this.protocol, this.collection, opt);
		})
	}, {
		_deep_sheet_:true,
		"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
		{
			return function (object, opt) {
				//console.log("action : ", object, opt);
				var self = this;
				return deep.when(old.call(this, object, opt))
				.done(function (object) {
					$.jStorage.set(self.path, self.collection, opt);
				});
			};
		})
	});

    deep.coreUnits = deep.coreUnits || [];
	deep.coreUnits.push("req::deep-jstorage/units/collection");
	//__________________________________________________
	return deep.jstorage.Collection;
});
