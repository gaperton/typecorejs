Features
===========

v2.0
----------------


Object+
----------------

Object.extend( )
Object.extend()
Type.implement( ObjProps, TypeProps['?'] )

Type.mixin( spec )

Core.

- Object.extend
    - backbone.js extend function
    - native properties from backbone.NestedTypes
    - .mixin
        - act like 'defaults' - don't merge existing members
        - however, merge literal JS objects
        - for functions, takes their prototype as source object.
    - defaults spec
    - type specs with automatic type casts
    - serialization control
    - nested objects
    - Collection type
    - shallow and deep copying
    - NO events. NO REST.

Model
  - change events
  - 'dirty' marks
  - Model.from
  - Collection.subsetOf
  - persistence
    - REST adapter
    - LocalStorage adapter
    - IndexDB adapter

View
  - view state
  - subviews
  - event subscription
  - data binding
  - dispose


(?) Dirty marks idea allows for transactional implementation for changed events.
Dirty marks can be evaluated recursively, which si
model.begin()
model.end() will send out change events.

However, there are also change:attr events, which needs to be executed immediately.

Individual update must send both change + change:attr, or defer this in case if executed as the part of transaction.
- don't trigger 'change' if executed as reaction on change:attr on the same object.
Or, we could do 'wave updates' - execute bulk set, then send out all events.

(!) Another mechanics for change events could be implemented on top of 'dirty' marks
    In this case, every change operation marks attribute as 'dirty'.
    At the end of the transaction, it must send change:attr for dirties, several times until everything
