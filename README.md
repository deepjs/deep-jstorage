# deep-jstorage


local storage driver (store) for deepjs (based on [jstorage](http://www.jstorage.info/)) 

## install

```shell
bower install deep-jstorage
```

You should also have [jstorage](http://www.jstorage.info/) loaded in your page.

## Collection store Usage 

```javascript 
var deep = require("deepjs/deep");
require("deep-jstorage/lib/collection");
require("deep-restful/index");

new deep.jstorage.Collection("myprotocol");

deep.restful("myprotocol")
.post({ hello:"world" })
.get()
.log();

deep.nodes("myprotocol::?hello=world").log();

deep.restful("myprotocol")
.put({ id:'test', myVar:"hello", myObject:{ myVar2:12344 }})
.slog()
.patch("patched with query","test/myVar")
.slog()
.get("test")
.slog()
.put(7777777,"test/myObject/myVar2")
.slog()
.patch({other:true},"test/myObject/myVar2")
.slog()
.get("test")
.log();
```

## Object store Usage 

```javascript
var deep = require("deepjs/deep");
require("deep-jstorage/lib/object");
require("deep-restful/index");

new deep.jstorage.Object("myprotocol");

deep.restful("myprotocol")
.post({ hello:"world", id:"/my/path" })
.get()
.log();

deep.nodes("myprotocol::/my/path").log();

//...

```



