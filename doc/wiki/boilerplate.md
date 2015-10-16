### Boilerplate

Here's a simple page that you can copy in order to get going.  A few basic things are illustrated here:

 - Nodes (with class **w**) are positioned absolute.
 - CSS is used to set the z-index of nodes and of jsPlumb connectors (which have a class of **jsplumb-connector**). In 
 this case, nodes are placed above connectors.
 - You should use `jsPlumb.ready` to wrap your initial access to jsPlumb.
 - A listener is bound to the `connection` event on jsPlumb.

 
 
-
      <!doctype html>
      <html>
        <head>
            <title>jsPlumb simple example</title>
            <style type="text/css">
                .w { 
                    border:1px solid #456;
                    position:absolute;
                    width:60px;
                    height:60px;
                    z-index:10;
                 }
                 
                 .jsplumb-connector { 
                     z-index:9;
                 }

                 #one { 
                     left:50px;
                     top:50px;
                 }

                 #two {
                     left:350px;
                     top:350px;
                 }
            </style>
        </head>
        <body>
            <div id="one">one</div>
            <div id="two">two</div>
            Drag a connection from <strong>one</strong> to <strong>two</strong>
            <div id="debug"></div>

            <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js'></script>
            <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js'></script>
            <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jsPlumb/1.4.1/jquery.jsPlumb-1.4.1-all.js"></script>
        
            <script type="text/javascript">
                jsPlumb.ready(function() {
                    jsPlumb.addEndpoint("one", { isSource:true });
                    jsPlumb.addEndpoint("two", { isTarget:true });

                    jsPlumb.bind("connection", function(info) {
                        console.log("new connection:", info);
                        $("#debug").html("hello.");
                    });
                });
            </script>
        </body>
    </html>
                