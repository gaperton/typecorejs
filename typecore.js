( function(){
    Object.xmap( dest, source, fun, context ){
        context || ( context = null );

        for( var name in source ){
            if( source.hasOwnProperty( name ) ){
                value = fun.call( context, source[ name ], name );
                typeof value === 'undefined' || ( dest[ name ] = value );
            }
        }

        return dest;
    }


    Object.xcopy = function( dest, source ){
        for( var name in source ){
            source.hasOwnProperty( name ) && ( dest[ name ] = source[ name ] );
        }

        return dest;
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
    }

    function Class(){
        return this.initialize.apply( this, arguments );
    }

    Class.prototype.initialize = function(){};

    Class.mixin = function(){
        for( var i = 0; i < arguments.length; i++ ){
            var source = arguments[ i ];
            typeof source === 'function' && ( source = source.prototype );
            Object.xmerge( this.prototype, source );
        }

        return this.prototype;
    };

    Object.extend = Class.extend = function( protoProps, staticProps ) {
        var parent = this === Object ? Class : this;

        if( !protoProps.hasOwnProperty( 'constructor' ) ){
            protoProps.constructor = function Ctor(){ return parent.apply( this, arguments ); };
        }

        var child = protoProps.constructor;

        Object.xcopy( child, parent );
        Object.xcopy( child, staticProps );

        child.prototype = Object.create( parent.prototype,
            Object.xmap( {}, protoProps.properties, function( spec ){
                return spec instanceof Function ? { get : spec } : spec;
            })
        );

        Object.xcopy( child.prototype, protoProps );

        child.__super__ = parent.prototype;

        return child;
    };

    function flatten( args, signature ){
        for( var i = 0; i < args.length; i++ ){
            var type = args[ i ];
            if( type instanceof Array ){
                flatten( type, signature );
            }
            else{
                signature.push( type.check );
            }
        }
    }

    Class.implement = function( spec ){
        Object.xmap( this.prototype, spec, function( method, name ){
            var proxy = this.prototype[ name ];
            if( proxy && proxy.implement ){
                proxy.implement( method );
            }

            /*
            if( proxy && proxy.isProxy ){
                return proxy._returns ?
                    function(){
                        proxy.apply( this, arguments );
                        return proxy._returns( method.apply( this, arguments ) );
                    }
                    : function(){
                        proxy.apply( this, arguments );
                        return method.apply( this, arguments );
                    };
            }*/
        }, this );
    };

    Object.implement = function( Class, spec ){ return Class.implement( spec ); };

    function _returns( type ){
        delete this.takes;
        delete this.returns;
        var checker = typeof type === 'function' ? type.check : function( value ){ return value === type; };

        this._returns = function( value ){
            if( !checker( value ) ) throw new TypeError();
            return value;
        };

        this._default = typeof type === 'function' ? type.create() : value;

        return this;
    }

    function _takes(){
        var signature = [],
            requiredArgs = arguments.length,
            prev = this === Function ? function(){ throw new TypeError(); } : this;

            for( var i = 0; i < arguments.length; i++ ){
                if( arguments[ i ] instanceof Array ){
                    requiredArgs = i;
                    break;
                }
            }

            flatten( arguments, signature );

        function proxy(){
            if( arguments.length > signature.length || arguments.length < requiredArgs ){
                prev.apply( this, arguments );
            }
            else{
                for( var i = 0; i < arguments.length; i++ ){
                    if( !signature[ i ]( arguments[ i ] ) ){
                        prev.apply( this, arguments );
                        break;
                    }
                }
            }

            if( '_default' in this ) return this._default;
        }

        proxy.takes = _takes;
        proxy.returns = _returns;
        proxy.isProxy = true;
        return proxy;
    }

    Function.takes = _takes;

    function _or( Type ){
        var prev = this;

        return {
            check : typeof Type === 'function' ?
                function( value ){
                    return Type.check( value ) || prev.check( value );
                } : function( value ){
                    return value === Type || prev.check( value );
                },

            or : _or
        }
    }

    Function.prototype.or = _or;
    Function.prototype.check = function( value ){ return value instanceof this; };

    Function.check  = function( value ){ return typeof value === 'function'; };
    Number.check    = function( value ){ return typeof value === 'number'; };
    String.check    = function( value ){ return typeof value === 'string'; };
    Boolean.check   = function( value ){ return typeof value === 'boolean'; };
} )();
