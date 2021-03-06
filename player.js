var Player = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set( 9*TILE, 0*TILE );
	
	this.width = 159;
	this.height = 163;
	
	this.offset = new Vector2();
	this.offset.set(-55, -87);
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.image.src = "hero2.png"
};

Player.prototype.update = function(deltaTime)
{
		var left = false;
	var right = false;
	var jump = false;
	
	// check keyboard press events
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		left = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		right = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		jump = true;
	}
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0;		//accelaration 
	var ddy = GRAVITY;
	
	if(left)
		ddx = ddx - ACCEL;
	else if(wasleft)
		ddx = ddx - FRICTION
		
	if(right)
		ddx - ddx + ACCEL;
	else if (wasright)
		ddx = ddx - FRICTION;
		
	if (jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;		// apply an instantaneous (large) vertical impulse
		this.jumping = true;
	}
	
	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if ((wasleft && (this.velocity.x > 0)) || 
		(wasright && (this.velocity.x < 0)))
	{
		// clamp at zero to prevent friction from creating Jiigy from side to side ;)
		this.velocity.x = 0	
	}
	
	
	
// -------------------------- COLLISION DETECTO SEATO ---------------------------//

	// we''ll add some shtuff here l8r dawg
	
	// our collision detection logic is greatly simplified by the fact that the
	// player is a rectangle and is exactly the same size as a single tile.
	// so we know that the player can only ever occupy 1, 2, or 4 cells.
	
	//This means we can short-circuit and avoid building a general purpose
	// collision detection engine by simply looking at the 1-4 cells
	//the player occupies
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;	//true if player overlaps right
	var ny = (this.position.y)%TILE;	//true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	// if the player has vertical velocity, then check to see if they have hit a platform
	//above, in which case, stop their vertical velocity, and clamp their y position:
	if(this.velocity.y > 0) 
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx))
		{
			// clamp the y positon to avoid falling into the platform below
			this.position.y = tileToPixel (ty);
			this.velocity.y = 0;				// stop downward velocity
			this.falling = false;				// no longer falling
			this.jumping = false;				// no longer jumping
			ny = 0;								// no longer overlaps cells below
		}
	}
	
	
	
	
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}