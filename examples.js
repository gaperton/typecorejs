// function specs
{
    some : Function.args( Integer, Integer )
    (function( a, b ){

    }),

    some : Function.args( Integer )( Integer, undefined )
    .body( function( a, b ){

    }),

    some : function( a, b ){

    }.args( Integer, Integer )
    .before( function(){

    })
    .after( function(){

    });
}


var SetOptions = Object.Plain;

// TODO: enum values variant types,


// TODO: object patterns
var Options = Object.type({
    a : Type, b : Type, c : Type
})

// TODO: array patterns
var List = Array.of( Number )
var List = Number.Array
var List = [ Number.or( null ) ];

//TODO: new spec for optional parameters
.takes( Array.or( Model ).or( Object.Plain ), SetOptions['?'] )

// undefined, used for optional function arguments
Type['?'] === Type.or( undefined )

//Anything except undefined.
Object.ANY === Object['*']

//Plain JS Object (Type.prototype === Object.prototype )
Object.STRICT === Object['!']

// TODO: function types as argument types
.takes( Object, Object, [ Function.takes( Object['*'], String ).returns( Object.Any ), [ Object ] ])

// C++ style...
var Something = Object.extend({ // TODO: extend any ctor function
    counter : 0,

    add : Function
        .takes( Array.or( Model ).or( Object['!'] ), SetOptions['?'] )
        .returns.self,

    set : Function
        .takes( String, Object.ANY, SetOptions['?'] )
        .takes( Object['!'], SetOptions['?'] )
        .returns.self,

    initialize : Function.takes( Object.Plain ).returns(),

    getLength : Function.returns( Number ),

    get : Function.takes( String.or( Number ) ).returns( Model.or( undefined ) )
})



Something.implement({
    add : function( a, b ){

    }
});


Object.implement( Something, {

})
