 /**
 * Class: Connectors.Flowchart
 * Provides 'flowchart' connectors, consisting of vertical and horizontal line segments.
 */
;(function() {
   
    /**
     * Function: Constructor
     * 
     * Parameters:
     * 	stub - minimum length for the stub at each end of the connector. This can be an integer, giving a value for both ends of the connections, 
     * or an array of two integers, giving separate values for each end. The default is an integer with value 30 (pixels). 
     *  gap  - gap to leave between the end of the connector and the element on which the endpoint resides. if you make this larger than stub then you will see some odd looking behaviour.  defaults to 0 pixels.     
     * cornerRadius - optional, defines the radius of corners between segments. defaults to 0 (hard edged corners).
     */
    jsPlumb.Connectors.Flowchart = function(params) {
        this.type = "Flowchart";
        params = params || {};
        var self = this,
            _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments),		
            midpoint = params.midpoint || 0.5,
            points = [], segments = [],
            grid = params.grid,
            lastx = -1, lasty = -1, lastOrientation,	
            cornerRadius = 10,//params.cornerRadius != null ? params.cornerRadius : 20,	
            sgn = function(n) { return n < 0 ? -1 : n == 0 ? 0 : 1; },
            /**
             * helper method to add a segment.
             */
            addSegment = function(segments, x, y, sx, sy) {
                
                var lx = lastx == -1 ? sx : lastx,
                    ly = lasty == -1 ? sy : lasty,
                    o = lx == x ? "v" : "h",
                    sgnx = sgn(x - lx),
                    sgny = sgn(y - ly);
                    
                lastx = x;
                lasty = y;				    		
                    
                    /*
                     *	halfStroke = self.lineWidth / 2;								
                        
                    // previously:
                    //p = p + " L " + x1 + " " + y1;
                    //p = p + " M " + x1 + " " + y1;
                                        
                    // now, with support for painting an extra bit at the end each line:
                    p = p + " L " + x1 + " " + y1;											
                    p = p + " L " + (x1 + (multX * halfStroke)) + " " + (y1 + (multY * halfStroke));
                    */												
            
                            
                /*_super.addSegment("Straight", {
                    x1:lx, y1:ly, x2:x, y2:y,
                    cssClass:lx == x ? "jsPlumb-vertical" : "jsPlumb-horizontal"
                });*/
                segments.push([lx, ly, x, y, o, sgnx, sgny]);				
            },
            segLength = function(s) {
                return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));    
            },
            writeSegments = function(segments) {
                for (var i = 0; i < segments.length - 1; i++) {
                    var current = segments[i], next = segments[i + 1], d = 1 * cornerRadius;
                    if (cornerRadius > 0 && current[4] != next[4] && segLength(current) > d && segLength(next) > d) {
                        // right angle! adjust current segment's end point, and next segment's start point.
                        current[2] -= current[5] * cornerRadius;
                        current[3] -= current[6] * cornerRadius;
                        next[0] += next[5] * cornerRadius;
                        next[1] += next[6] * cornerRadius;														                         			
                        var ac = (current[6] == next[5] && next[5] == 1) ||
                                 ((current[6] == next[5] && next[5] == 0) && current[5] != next[6]) ||
                                 (current[6] == next[5] && next[5] == -1),
                            sgny = next[1] > current[3] ? 1 : -1,
                            sgnx = next[0] > current[2] ? 1 : -1,
                            sgnEqual = sgny == sgnx,
                            cx = (sgnEqual && ac || (!sgnEqual && !ac)) ? next[0] : current[2],
                            cy = (sgnEqual && ac || (!sgnEqual && !ac)) ? current[3] : next[1];                                                        
                            
                        //*
                        _super.addSegment("Arc", {
                            r:cornerRadius, 
                            x1:current[2], 
                            y1:current[3], 
                            x2:next[0], 
                            y2:next[1],
                            cx:cx,
                            cy:cy,
                            ac:ac
                        });
                        //*/						
                    }
                    
                    _super.addSegment("Straight", {
                        x1:segments[i][0], y1:segments[i][1], x2:segments[i][2], y2:segments[i][3]
                    });
                }
                var ls = segments[segments.length - 1];
                // last segment
                _super.addSegment("Straight", {
                    x1:ls[0], y1:ls[1], x2:ls[2], y2:ls[3]
                });
            };
        
        this._compute = function(sourcePos, targetPos, sourceEndpoint, targetEndpoint, 
            sourceAnchor, targetAnchor, lineWidth, minWidth, sourceInfo, targetInfo) {
            
            var paintInfo = _super.prepareCompute(sourcePos, targetPos, sourceEndpoint, targetEndpoint, 
            sourceAnchor, targetAnchor, lineWidth, minWidth, sourceInfo, targetInfo);
            
            var segments = [];
            lastx = -1; lasty = -1;
            lastOrientation = null;          
            
            var midx = paintInfo.startStubX + ((paintInfo.endStubX - paintInfo.startStubX) * midpoint),
                midy = paintInfo.startStubY + ((paintInfo.endStubY - paintInfo.startStubY) * midpoint);
                                                                                         
            // add the start stub segment.
            addSegment(segments, paintInfo.startStubX, paintInfo.startStubY, paintInfo.sx, paintInfo.sy);			
    
            var findClearedLine = function(start, mult, anchorPos, dimension) {
                    return start + (mult * (( 1 - anchorPos) * dimension) + _super.maxStub);
                },
                lineCalculators = {
                    oppositex : function() {
                        if (sourceEndpoint.elementId == targetEndpoint.elementId) {
                            var _y = paintInfo.startStubY + ((1 - sourceAnchor.y) * sourceInfo.height) + _super.maxStub;
                            return [ [ paintInfo.startStubX, _y ], [ paintInfo.endStubX, _y ]];
                        }
                        else if (paintInfo.isXGreaterThanStubTimes2 && (paintInfo.segment == 1 || paintInfo.segment == 2)) {
                            return [[ midx, paintInfo.sy ], [ midx, paintInfo.ty ]];
                        }    
                        else {                            
                            return [[ paintInfo.startStubX, midy ], [ paintInfo.endStubX, midy ]];                
                        }
                    },
                    orthogonalx : function() {
                        if (paintInfo.segment == 1 || paintInfo.segment == 2) {
                            return [ [ paintInfo.endStubX, paintInfo.startStubY  ]];
                        }
                        else {
                            return [ [ paintInfo.startStubX, paintInfo.endStubY ]];
                        }
                    },
                    perpendicularx : function() {                
                        if ((paintInfo.segment == 1 && paintInfo.to[1] == 1) || (paintInfo.segment == 2 && paintInfo.to[1] == -1)) {                  
                            if (Math.abs(paintInfo.tx - paintInfo.sx) > _super.maxStub)
                                return [ [ paintInfo.endStubX, paintInfo.startStubY ]];            
                            else
                                return [ [ paintInfo.startStubX, paintInfo.startStubY ], [ paintInfo.startStubX, paintInfo.my ], [ paintInfo.endStubX, paintInfo.my ]];                                
                        }  
                        else if ((paintInfo.segment == 3 && paintInfo.to[1] == -1) || (paintInfo.segment == 4 && paintInfo.to[1] == 1)) {                    
                            return [ [ paintInfo.startStubX, paintInfo.my ], [ paintInfo.endStubX, paintInfo.my ]];
                        }
                        else if ((paintInfo.segment == 3 && paintInfo.to[1] == 1) || (paintInfo.segment == 4 && paintInfo.to[1] == -1)) {                
                            return [ [ paintInfo.startStubX, paintInfo.endStubY ]];
                        }
                        else if ((paintInfo.segment == 1 && paintInfo.to[1] == -1) || (paintInfo.segment == 2 && paintInfo.to[1] == 1)) {                
                            if (Math.abs(paintInfo.tx - paintInfo.sx) > _super.maxStub)                    
                                return [ [ midx, paintInfo.startStubY ], [ midx, paintInfo.endStubY ]];                    
                            else
                                return [ [ paintInfo.startStubX, paintInfo.endStubY ]];                                        
                        }
                    },
                    oppositey : function() {
                        if (sourceEndpoint.elementId == targetEndpoint.elementId) {
                            var _x = paintInfo.startStubX + ((1 - sourceAnchor.x) * sourceInfo.width) + _super.maxStub;
                            return [ [ _x, paintInfo.startStubY ], [ _x, paintInfo.endStubY ]];
                        }
                        else if (paintInfo.isYGreaterThanStubTimes2 && (paintInfo.segment == 2 || paintInfo.segment == 3)) {
                            return [[ paintInfo.sx, midy ], [ paintInfo.tx, midy ]];
                        }    
                        else {
                            return [[ midx, paintInfo.startStubY ], [midx, paintInfo.endStubY ]];                
                        }
                    },
                    orthogonaly : function() {
                        if (paintInfo.segment == 2 || paintInfo.segment == 3) {
                            return [ [ paintInfo.startStubX, paintInfo.endStubY  ]];
                        }
                        else {
                            return [ [ paintInfo.endStubX, paintInfo.startStubY ]];
                        }
                    },
                    perpendiculary : function() {                
                        if ((paintInfo.segment == 2 && paintInfo.to[0] == -1) || (paintInfo.segment == 3 && paintInfo.to[0] == 1)) {                    
                            if (Math.abs(paintInfo.tx - paintInfo.sx) > _super.maxStub)
                                return [ [paintInfo.startStubX, paintInfo.endStubY ]];                    
                            else
                                return [ [paintInfo.startStubX, midy ], [ paintInfo.endStubX, midy ]];                                        
                        }  
                        else if ((paintInfo.segment == 1 && paintInfo.to[0] == -1) || (paintInfo.segment == 4 && paintInfo.to[0] == 1)) {
                            return [ [ paintInfo.mx, paintInfo.startStubY ], [ paintInfo.mx, paintInfo.endStubY ]];
                        }
                        else if ((paintInfo.segment == 1 && paintInfo.to[0] == 1) || (paintInfo.segment == 4 && paintInfo.to[0] == -1)) {                
                            return [ [ paintInfo.endStubX, paintInfo.startStubY ]];
                        }
                        else if ((paintInfo.segment == 2 && paintInfo.to[0] == 1) || (paintInfo.segment == 3 && paintInfo.to[0] == -1)) {                
                            if (Math.abs(paintInfo.ty - paintInfo.sy) > _super.maxStub)                    
                                return [ [ paintInfo.startStubX, midy ], [ paintInfo.endStubX, midy ]];                  
                            else
                                return [ [ paintInfo.endStubX, paintInfo.startStubY ]];                                    
                        }
                    }
                };                                                 
    
            //*
            var p = lineCalculators[paintInfo.anchorOrientation + paintInfo.sourceAxis]();
            if (p) {
                for (var i = 0; i < p.length; i++) {                	
                    addSegment(segments, p[i][0], p[i][1]);
                }
            }                                                    
//    */
            addSegment(segments, paintInfo.endStubX, paintInfo.endStubY);
    
            // end stub
            addSegment(segments, paintInfo.tx, paintInfo.ty);              
            
            writeSegments(segments);
            
            return paintInfo.points;
        };		
    };
})();