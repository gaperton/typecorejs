( function(){
    Object.xmap = function( dest, source, fun, context ){
        context || ( context = null );

        for( var name in source ){
            if( source.hasOwnProperty( name ) ){
                value = fun.call( context, source[ name ], name );
                typeof value === 'undefined' || ( dest[ name ] = value );
            }
        }

        return dest;
    }

    Object.every = function( obj, fun, context ){
        if( obj.every ) return obj.every( fun, context );

        for( var name in source ){
            if( source.hasOwnProperty( name ) ){
                if( !fun.call( context, source[ name ] ) ) return false;
            }
        }

        return true;
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

    Object.isLiteral = function( value ){
        return value && typeof value === 'object' &&  Object.getPrototypeOf( value ) === Object.prototype;
    };

    Object.isJSONLiteral = function( value ){
        var type = typeof value,
            isJSON = value === null || type === 'number' || type === 'string' || type === 'boolean';

        if( !isJSON && type === 'object' ){
            var proto = Object.getPrototypeOf( value );

            if( proto === Object.prototype || proto === Array.prototype ){
                isJSON = Object.every( value, Object.isJsonLiteral );
            }
        }

        return isJSON;
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
        this._initAttributes();
        return this.initialize.apply( this, arguments );
    }

    Class.prototype.initialize = function(){};
    Class.prototype._initAttributes = function(){};

    Class.mixin = function(){
        for( var i = 0; i < arguments.length; i++ ){
            var source = arguments[ i ];
            typeof source === 'function' && ( source = source.prototype );
            Object.xmerge( this.prototype, source );
        }

        return this.prototype;
    };

    function createDefaults( Parent, Child ){
        if( typeof spec === 'function' ){
          Child.prototype._initDefaults = function( target ){
            Parent.prototype._initDefaults( this );
            Object.xcopy( target, spec() );
          };
        }
        else{
            var fbody = '', refs = {};

            for( var name in spec ){
              var value = spec[ name ];

              if( typeof value !== 'undefined' ){
                if( isJSONLiteral( value ) ){
                  fbody += 't.' + name + '=' + JSON.stringify( value ) + ';';
                }
                else{
                  refs[ name ] = value;
                }
              }
            }

            var literals = new Function( 't', fbody );
            return function( target ){
                literals( target );
                Object.xcopy( target, refs );
            }
        }
    }

    Object.extend = Class.extend = function( protoProps, staticProps ) {
        var parent = this === Object ? Class : this;

        if( !protoProps.hasOwnProperty( 'constructor' ) ){
            protoProps.constructor = function Ctor(){ return parent.apply( this, arguments ); };
        }

        var child = protoProps.constructor;

        Object.xcopy( child, parent, staticProps );

        child.prototype = Object.create( parent.prototype,
            Object.xmap( {}, protoProps.properties, function( spec ){
                return spec instanceof Function ? { get : spec } : spec;
            })
        );

        Object.xcopy( child.prototype, protoProps );

        child.__super__ = parent.prototype;




        child._initAttributes = function(){
            parent.prototype._initAttributes.call( this );
            initDefaults( this );
        }

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
