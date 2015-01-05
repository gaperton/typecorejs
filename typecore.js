( function(){
    function xmapcopy( dest, source, fun, context ){
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
        if( arguments.length > 2 ) return xmapcopy.apply( null, arguments );

        for( var name in source ){
            source.hasOwnProperty( name ) && ( dest[ name ] = source[ name ] );
        }

        return dest;
    }

    function Class(){
        return this.initialize.apply( this, arguments );
    }

    Class.prototype.initialize = function(){};

    Object.extend = Class.extend = function( protoProps, staticProps ) {
        var parent = this === Object ? Class : this,
        child = protoProps.hasOwnProperty( 'constructor' ) ? protoProps.constructor :
            ( protoProps.constructor = function(){
                return parent.apply( this, arguments );
            });

        Object.xcopy( child, parent );
        Object.xcopy( child, staticProps );

        child.prototype = Object.create( parent.prototype,
            Object.xcopy( {}, protoProps.properties, function( spec ){
                return spec instanceof Function ? { get : spec } : spec;
            })
        );

        delete protoProps.properties;
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
        Object.xcopy( this.prototype, spec, function( method, name ){
            var proxy = this.prototype[ name ];
            if( proxy && proxy.isProxy ){
                return proxy._returns ?
                    function(){
                        proxy.apply( this, arguments );
                        var res = method.apply( this, arguments );
                        if( !proxy._returns.check( res ) ){
                            throw new TypeError();
                        }

                        return res;
                    }
                : function(){
                    proxy.apply( this, arguments );
                    return method.apply( this, arguments );
                }
            }
        }, this );
    }

    Object.implement = function( Class, spec ){ return Class.implement( spec ); }

    function _returns( type ){
        delete this.takes;
        delete this.returns;
        this._returns = typeof type === function ? type :
                { check : function( value ){ return value === type; };

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

    Function.prototype.check = function( value ){
        return value instanceof this;
    }

    Function.check = function( value ){
        return typeof value === 'function';
    }

    Number.check = function( value ){
        return typeof value === 'number';
    }

    String.check = function( value ){
        return typeof value === 'string';
    }

    Boolean.check = function( value ){
        return typeof value === 'boolean';
    }
} )();
