/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deep-restful/lib/object", "jstorage/jstorage.min"],function (require, deep)
{
	deep.jstorage = deep.jstorage || {};
	/**
	 * deep.jstorage.Object
	 * @param  {[type]} protocol               (optional)[description]
	 * @param  {[type]} root					(optional)[description]
	 * @param  {[type]} schema                  (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	
	deep.jstorage.Object = deep.Classes(deep.Object,
		function(protocol, root, schema, options){
			if(protocol && typeof protocol === 'object')
			{
				options = protocol;
				protocol = null;
			}
			options = options || {};
			var path = options.path || protocol;
			if(!path)
				throw deep.errors.Store("jstorage.Object need a path at constructor. please provide a options.path or a protocol.");
			// console.log("jstorage init : ", protocol, root, this.root, $.jStorage.get(path))
			var current = $.jStorage.get(path) || root || this.root;
			this.path = path;
			//console.log("root : ", current)
			if(!current)
			{
				current = {};
				$.jStorage.set(path, current, options);
			}
			this.root = current;
			
			deep.up(this, options);
		},
		{
			flush:deep.compose.after(function(opt){
				this.root  = {};
				$.jStorage.set(this.path || this.protocol, this.root, opt);
			})
		},{
			_deep_sheet_:true,
			"dq.up::./!":{ hello:"world" },
			"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
			{
				return function (object, opt) {
					var self = this;
					return deep.when(old.call(this, object, opt))
					.done(function (object) {
						$.jStorage.set(self.path, self.root, opt);
					});
				};
			})
		});

        //deep.coreUnits = deep.coreUnits || [];
		//deep.coreUnits.push("req::deep-jstorage/units/object");
	//__________________________________________________
	return deep.jstorage.Object;
});
