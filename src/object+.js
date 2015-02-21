Object.xmap = function( dest, source, fun, context ){
    context || ( context = null );

    for( var name in source ){
        if( source.hasOwnProperty( name ) ){
            value = fun.call( context, source[ name ], name );
            typeof value === 'undefined' || ( dest[ name ] = value );
        }
    }

    return dest;
};

Object.xcopy = function( dest ){
    for( var i = 1; i < arguments.length; i++ ){
        var source = arguments[ i ];

        for( var name in source ){
            source.hasOwnProperty( name ) && ( dest[ name ] = source[ name ] );
        }
    }

    return dest;
};

Object.every = function( obj, fun, context ){
    if( obj.every ) return obj.every( fun, context );

    for( var name in source ){
        if( source.hasOwnProperty( name ) ){
            if( !fun.call( context, source[ name ] ) ) return false;
        }
    }

    return true;
};


Object.isLiteral = function( value ){
    return value && typeof value === 'object' &&  Object.getPrototypeOf( value ) === Object.prototype;
};

Object.xmerge = function( destination, source ){
    Object.xmap( destination, source, function( value, name ){
        if( !destination.hasOwnProperty( name ) ){
            return value;
        }
        else if( Object.isLiteral( destination[ name ] ) && Object.isLiteral( value ) ){
            return Object.xmerge( destination[ name ], value );
        }
    });

    return destination;
};

function Class(){
    this.set( this.defaults() );
    return this.initialize.apply( this, arguments );
}

Class.prototype = {
    initialize : function(){},
    defaults   : function(){
        return Object.xmap( {}, this._attributes, function( value ){
            return value.create();
        });
    },

    _attributes : {},

    set        : function( name, value ){
        if( typeof name === 'string' ){
            this[name] = value;
        }
        else{
            Object.xcopy( this, name );
        }
    },

    get : function( name ){
        return this[name];
    }
};

function Attribute( options ){

}

Attribute.prototype.attach = function( name ){
    if( Object.isJSONLiteral( options.value ) ){
        this.create = new Function( 'return ' + JSON.stringify( options.value ) + ';' );
    }
    else{
        this.create = function(){ return options.value; };
    }
};

var createAttributes = function(){
    function primitiveType( Ctor ){
        return function( value ){
            return new PrimitiveType({ value : value, type : Ctor });
        }
    }

    var factory = {
        'function' : function( Ctor ){
            return new Ctor.NestedType({ type : Ctor });
        },
        'boolean'  : primitiveType( Boolean ),
        'number'   : primitiveType( Number ),
        'string'   : primitiveType( String ),
        'object'   : function( value ){
            return value && value instanceof Attribute ? value : new Attribute({ value : value });
        }
    };

    return function( defaults ){
        return Object.xmap( {}, defaults, function( value, name ){
            return factory[ typeof value ]( value );
        });
    }
}();

Class.mixin = function(){
    for( var i = 0; i < arguments.length; i++ ){
        var source = arguments[ i ];
        typeof source === 'function' && ( source = source.prototype );
        Object.xmerge( this.prototype, source );
    }

    return this.prototype;
};

Object.extend = Class.extend = function( protoProps, staticProps ) {
    var Parent = this === Object ? Class : this;

    if( !protoProps.hasOwnProperty( 'constructor' ) ){
        function Ctor(){
            return Parent.apply( this, arguments );
        }

        protoProps.constructor = Ctor;
    }

    var Child = protoProps.constructor;

    Object.xcopy( Child, Parent, staticProps );

    Child.prototype = Object.create( Parent.prototype,
        Object.xmap( {}, protoProps.properties, function( spec ){
            return spec instanceof Function ? { get : spec } : spec;
        })
    );

    Object.xcopy( Child.prototype, protoProps );

    Child.prototype.defaults = function(){
        return Object.xcopy( Parent.prototype.defaults(), protoProps.defaults() );
    };

    Child.__super__ = Parent.prototype;

    return Child;
};
