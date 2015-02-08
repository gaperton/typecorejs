Nested.options = ( function(){
    var Attribute = Nested.Class.extend({
        type : null,

        property : function( name ){
            var spec = {
                    set : function( value ){
                        this.set( name, value );
                        return value;
                    },

                    enumerable : false
                },
                get = this.get;

            spec.get = get ? function(){
                return get.call( this, this.attributes[ name ] );
            } : function(){
                return this.attributes[ name ];
            };

            return spec;
        },

        options : function( spec ){ return Object.xcopy( this, spec ); },
        initialize : function( spec ){ this.options( spec ); }
    },{
        bind : ( function(){
            var attributeMethods = {
                options : function( spec ){
                    spec.type || ( spec.type = this );
                    return new this.Attribute( spec );
                },

                value : function( value ){
                    return new this.Attribute({ type : this, value : value });
                }
            };

            return function(){
                for( var i = 0; i < arguments.length; i++ ){
                    Object.xcopy( arguments[ i ], attributeMethods, { Attribute : this } );
                }
            };
        })()
    });

    Attribute.extend({
        cast : function( value ){
            return value == null || value instanceof this.type ? value : new this.type( value );
        },

        create : function(){ return new this.type(); },
    }).bind( Function.prototype );

    var primitiveTypes = {
        string : String,
        number : Number,
        boolean : Boolean
    };

    function createAttribute( spec ){
        if( 'typeOrValue' in spec ){
            var typeOrValue = spec.typeOrValue,
                primitiveType = primitiveTypes[ typeof typeOrValue ];

            if( primitiveType ){
                spec = { type : primitiveType, value : typeOrValue };
            }
            else{
                spec = _.isFunction( typeOrValue ) ? { type : typeOrValue } : { value : typeOrValue };
            }
        }

        if( spec.type ){
            return spec.type.options( spec );
        }
        else{
            return new Attribute( spec );
        }
    }

    createAttribute.Type = Attribute;
    return createAttribute;
})();


function Attributes( defaults ){
    Object.xmap( this, defaults, function( spec, name ){
        return spec instanceof Attribute ? spec : Nested.options({ typeOrValue : spec });
    });
}

Attributes.

Nested.value = function( value ){ return Nested.options({ value: value }); };
