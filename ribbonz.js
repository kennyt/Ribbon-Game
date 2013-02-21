var speed = 1
var RibbonGame = (function() {

  function Ribbon() {
    var that = this;
    that.x = 100;
    that.y = 190;
    that.direction = [0, .01];
    that.up = false
    that.tail = []
    _.times(99, function() { that.tail.push([0,0])});

    that.update = function() {
      that.tail.unshift([this.x, this.y])
      if (that.up) {
        that.direction = [that.direction[0], that.direction[1] - .30];
        console.log('boop');
      } else {
        that.direction = [that.direction[0], that.direction[1] + .006];
      }
      that.x += that.direction[0];
      that.y += that.direction[1];
      that.up = false;
    }

    that.changeDirection = function(dX, dY) {
      that.direction[0] = that.direction[0] + dX;
      that.direction[1] = that.direction[1] + dY;
    }

    that.draw = function(ctx) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(that.x,that.y, 15, 0, Math.PI * 2, true);
      ctx.fill();

      for (i = 0; i < 100; i++){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(that.tail[i][0] - i,that.tail[i][1], 15, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }

    that.moveUp = function() {
      that.up = true;
    }
  }

  function Blocks(xpos, ypos, radius, game) {
    var that = this;
    that.x = xpos;
    that.y = ypos;
    that.radius = radius;

    that.update = function() {
      that.x -= speed;
      if (that.x < 0) {
        game.blocks = _.without(game.blocks, that);
      }
    }

    that.draw = function(ctx) {
      ctx.fillStyle = "rgb(0,200,0)";
      ctx.beginPath();
      ctx.arc(that.x,that.y, that.radius, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  Blocks.randomGenerate = function(game) {
    var xpos = 800;
    var ypos = Math.floor(Math.random()*550);
    var radius = Math.floor(Math.random()*50 + 50);
    return new Blocks(xpos, ypos, radius, game);
  }

  function Game(ctx) {
    var score = 0;
    var that = this;
    that.blocks = [];
    that.ribbon = new Ribbon();

    that.start = function() {
      setInterval(function() {
        that.drawUpdate()
      }, 1000/60)

      setInterval(function() {
        that.checkBlocks();
        score++;
        $('.score').html(score);
        _.each(that.blocks, function(block){
          speed += .02
        })
      }, 1000)
    }

    that.draw = function() {
      ctx.clearRect(0,0,800,550);
      that.ribbon.draw(ctx);
      _.each(that.blocks, function(block) {
        block.draw(ctx);
      })
    }

    that.update = function() {
      that.ribbon.update();
      _.each(that.blocks, function(block) {
          block.update()
      })
      _.each(that.blocks, function(block) {
        that.checkCollision(block);
      })
      that.checkOutOfBounds();
    }

    that.drawUpdate = function() {
      that.update(ctx);
      that.draw(ctx);
    }

    that.checkBlocks = function() {
      if (that.blocks.length < 4) {
        that.blocks.push(Blocks.randomGenerate(that))
      }
    }

    that.checkCollision = function(block) {
      distance = (Math.sqrt(((that.ribbon.x - block.x) * ( that.ribbon.x - block.x)) +
                 ((that.ribbon.y - block.y) * ( that.ribbon.y - block.y))));
      if (distance < block.radius + 15) {
        location.reload();
      }
    }

    that.checkOutOfBounds = function() {
      if ((that.ribbon.x > 800) ||
          (that.ribbon.x < 0) ||
          (that.ribbon.y > 550) ||
          (that.ribbon.y < 0)) {
        location.reload();
      }
    }

    key('space', function(){ that.ribbon.moveUp() });
  }

  return {
    game : Game
  }

})()

$(function() {
  var canvas = $('canvas');
  var ctx = canvas.get(0).getContext("2d");
  game = new RibbonGame.game(ctx);
  game.start();



})