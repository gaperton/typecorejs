describe( 'Object.extend', function(){

});

describe( 'Object methods definitions', function(){
    describe( 'Type specs', function(){
        it( 'simple method', function(){
            var spec = Function.takes().returns();

            spec.implement( function(){} );


            var f = Function.takes( Number ).returns( Number )
                    .implement( function( n ){
                        return n * 2;
                    });


            var x = {
                do1 : Function.takes().returns(),
                do2 : Function.takes().returns( Number ),
                do3 : Function.takes( Number ),
                do4 : Function.takes( String ).returns( Number ),
                do5 : Function.takes( String.or( Number ) ),
                do6 : Function.takes( String.or( Number ).or( null ) ),
                do7 : Function.takes( String, Number['?'] )
                do8 : Function.
            });




            var x = new X();

            x.doSomething();
        })
    })
});
