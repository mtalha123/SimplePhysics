//Simple vector utility class

define([], function(){
    
    function Vector2D(x, y){
        this._x = x;
        this._y = y;
        this._magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));;
    }
    
    Vector2D.prototype.multiplyByScalar = function(scalar){
        return new Vector2D(this._x * scalar, this._y * scalar);
    }
    
    Vector2D.prototype.addWith = function(vector2d){
        return new Vector2D(this._x + vector2d.getX(), this._y + vector2d.getY())
    }
    
    Vector2D.prototype.getMagnitude = function(){
        return this._magnitude;
    }
    
    Vector2D.prototype.projectOnto = function(vectorToProjectOnto){
        return vectorToProjectOnto.multiplyByScalar( ((this._x * vectorToProjectOnto.getX()) + (this._y * vectorToProjectOnto.getY())) / Math.pow(vectorToProjectOnto.getMagnitude(), 2));
    }
    
    Vector2D.prototype.getX = function(){
        return this._x;
    }
    
    Vector2D.prototype.getY = function(){
        return this._y;
    }
    
    Vector2D.prototype.set = function(newX, newY){
        this._x = newX;
        this._y = newY;
    }
    
    Vector2D.prototype.normalize = function(){
        this._x /= this._magnitude;
        this._y /= this._magnitude;
        this._magnitude = 1;
    }
    
    return Vector2D;
});