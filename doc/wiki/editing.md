jsPlumb 2.1.0 includes support for editing StateMachine and Bezier connectors.
 
### AdHoc Editing

### Creating an Editable Connection

Using the `connect` method, you can create a Connection that is immediately editable:

```javascript
var conn = jsPlumb.connect({
    source:"foo",
    target:"bar",
    editable:true
});
```

This will create a Connection that uses the edit defaults: dragging either element in the Connections discards edits, and
the editor closes when the user clicks anywhere in the document (that is not part of the editor). Should you wish to 
change either of these settings, you'll need to provide an `editParams` object to the `connect` call:
  
```javascript
var conn = jsPlumb.connect({
    source:"foo",
    target:"bar",
    editable:true,
    editParams:{
      clearOnDrag:false,
      closeOnMouseUp:false
    }
});
```  

### Saving Edits

### Loading Saved Edits

### CSS Classes

