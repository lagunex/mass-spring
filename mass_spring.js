var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('mass', 'assets/mass.png');
    game.load.image('wall', 'assets/fixed_v.png');
    game.load.image('spring', 'assets/spring.png');
}

var masses;
var walls;
var cursors;
var wallL, wallR;
var mass1, mass2, mass3;
var framenum;
var frameText;
var spr1, spr2, spr3, spr4;
var rl,st,dp;

function create() {
    //  Background color
    game.stage.backgroundColor = '#ffffff';

    //  We're going to be using physics, so enable the P2JS Physics system
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  The walls group contains the fixed walls
    walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.P2JS;

    // Here we create the left wall.
    wallL = walls.create(26, game.world.height/2, 'wall');
    wallL.body.immovable = true;
    wallL.body.mass = 1e50;
    wallL.body.fixedRotation = true;

    //  Now let's create the right wall
    wallR = walls.create(game.world.width - 26, game.world.height/2, 'wall');
    wallR.body.immovable = true;
    wallR.scale.x = -1;
    wallR.body.mass = 1e50;

    // The masses
    masses = game.add.group();
    masses.enableBody = true;
    masses.physicsBodyType = Phaser.Physics.P2JS;
    mass1 = masses.create(1*(game.world.width-52)/4+26, game.world.height/2, 'mass');
    mass2 = masses.create(2*(game.world.width-52)/4+26, game.world.height/2, 'mass');
    mass3 = masses.create(3*(game.world.width-52)/4+26, game.world.height/2, 'mass');

    //  The springs
    rl = (game.world.width - 20 - 2*wallL.width - 3*mass1.width)/4; // rest lenght
    st = 50; // stifness
    dp = 0;  // damping

    spr1 = game.physics.p2.createSpring(wallL,mass1,rl,st,dp,null,null,[.5,0],[-.5,0]);
    spr2 = game.physics.p2.createSpring(mass1,mass2,rl,st,dp,null,null,[.5,0],[-.5,0]);
    spr3 = game.physics.p2.createSpring(mass2,mass3,rl,st,dp,null,null,[.5,0],[-.5,0]);
    spr4 = game.physics.p2.createSpring(mass3,wallR,rl,st,dp,null,null,[.5,0],[-.5,0]);

    cursors = game.input.keyboard.createCursorKeys();
    framenum = 0;
    frameText = game.add.text(16,16,'Frame: 0',{fontsize: '32px', fill: '#000'});
}

function update() {
    framenum++;
    frameText.text = 'Frame: ' + framenum + '\t Time: ' + game.physics.p2.time.toFixed(2);

    //  Handle collisions
    game.physics.arcade.collide(masses, masses);
	game.physics.arcade.collide(masses, walls);

    //  Move the mass in the middle
    var dr = 5;
    if (cursors.left.isDown)
    {
        //  Move to the left
        mass2.body.x -= dr;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        mass2.body.x += dr;
    }
    else if (cursors.up.isDown)
    {
        //  Move up
        mass2.body.y -= dr;
    }
    else if (cursors.down.isDown)
    {
        //  Move down
        mass2.body.y += dr;
    }
}
