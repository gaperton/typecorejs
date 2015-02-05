Features
===========

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
