
/*global kaboom, loadRoot, loadSprite, loadSound,scene, layers, addLevel, add, text, pos, width, height, vec2, sprite, solid, body, action, destroy, go, camPos, keyPress, keyDown, scale, layer, dt, start, rgb, mouseIsClicked, localStorage*/

kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });
  
  // Speed identifiers
  const MOVE_SPEED = 120;
  const JUMP_FORCE = 360;
  const BIG_JUMP_FORCE = 550;
  let CURRENT_JUMP_FORCE = JUMP_FORCE;
  const FALL_DEATH = 400;
  const ENEMY_SPEED = 20;
  
  // Game logic
  let isJumping = true;
  let username = "";
  let highestScore = localStorage.getItem('highestScore') || 0;
  
  // Ask for username
  username = prompt("Enter your username:");

  loadRoot('https://i.imgur.com/');

  loadSprite('coin', 'wbKxhcd.png');
  loadSprite('evil-shroom', 'KPO3fR9.png');
  loadSprite('brick', 'pogC9x5.png');
  loadSprite('block', 'M6rwarW.png');
  loadSprite('mario', 'Wb1qfhK.png');
  loadSprite('mushroom', '0wMd92p.png');
  loadSprite('surprise', 'gesQ1KP.png');
  loadSprite('unboxed', 'bdrLpi6.png');
  loadSprite('pipe-top-left', 'ReTPiWY.png');
  loadSprite('pipe-top-right', 'hj2GK4n.png');
  loadSprite('pipe-bottom-left', 'c1cYSbt.png');
  loadSprite('pipe-bottom-right', 'nqQ79eI.png');
  
  loadSprite('blue-block', 'fVscIbn.png');
  loadSprite('blue-brick', '3e5YRQd.png');
  loadSprite('blue-steel', 'gqVoI2b.png');
  loadSprite('blue-evil-shroom', 'SvV4ueD.png');
  loadSprite('blue-surprise', 'RMqCc1G.png');

  
  
  scene('game', ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj');
      

  
    const maps = [
      [
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '                                      ',
        '     %   =*=%=                        ',
        '                                      ',
        '                            -+        ',
        '                    ^   ^   ()        ',
        '==============================   =====',
      ],
      [
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£        @@@@@@              x x        £',
        '£                          x x x        £',
        '£                        x x x x  x   -+£',
        '£               z   z  x x x x x  x   ()£',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      ],
      [
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£     @@@@@@@@@@          x x          £',
        '£                       x x x          £',
        '£                  x x x x x          -+£',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      ],
      [
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£                                       £',
        '£              @@@@@@@@@@               £',
        '£            x x x x x x x x x          £',
        '£          x x x x x x x x x x          £',
        '£        x x x x x x x x x x x          £',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      ],
    ];
  
    const levelCfg = {
      width: 20,
      height: 20,
      '=': [sprite('block'), solid()],
      '$': [sprite('coin'), 'coin'],
      '%': [sprite('surprise'), solid(), 'coin-surprise'],
      '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
      '}': [sprite('unboxed'), solid()],
      '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
      ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
      '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
      '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
      '^': [sprite('evil-shroom'), solid(), 'dangerous'],
      '#': [sprite('mushroom'), solid(), 'mushroom', body()],
      '!': [sprite('blue-block'), solid(), scale(0.5)],
      '£': [sprite('blue-brick'), solid(), scale(0.5)],
      'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
      '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
      'x': [sprite('blue-steel'), solid(), scale(0.5)],
    };
  
    const gameLevel = addLevel(maps[level], levelCfg);
  
    const scoreLabel = add([
    text('(Your Score: ' + score + ')'),
  
      pos(200, 6),
      layer('ui'),
      {
        value: score,
      },
    ]);
  
    const usernameLabel = add([
      text(username + ' (Highest: ' + highestScore + ')'),
      pos(350, 10),
      layer('ui'),
      {
        value: username,
      },
    ]);
  
    add([text('level ' + parseInt(level + 1)), pos(40, 6)]);
  
    function big() {
      let timer = 0;
      let isBig = false;
      return {
        update() {
          if (isBig) {
            CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
            timer -= dt();
            if (timer <= 0) {
              this.smallify();
            }
          }
        },
        isBig() {
          return isBig;
        },
        smallify() {
          this.scale = vec2(1);
          CURRENT_JUMP_FORCE = JUMP_FORCE;
          timer = 0;
          isBig = false;
        },
        biggify(time) {
          this.scale = vec2(2);
          timer = time;
          isBig = true;
        },
      };
    }
  
    const player = add([
      sprite('mario'),
      solid(),
      pos(30, 0),
      body(),
      big(),
      origin('bot'),
    ]);
  
    action('mushroom', (m) => {
      m.move(20, 0);
    });
  
    player.on('headbump', (obj) => {
      if (obj.is('coin-surprise')) {
        gameLevel.spawn('$', obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn('}', obj.gridPos.sub(0, 0));
      }
      if (obj.is('mushroom-surprise')) {
        gameLevel.spawn('#', obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn('}', obj.gridPos.sub(0, 0));
      }
    });
  
    player.collides('mushroom', (m) => {
      destroy(m);
      player.biggify(6);
    });
  
    player.collides('coin', (c) => {
      destroy(c);
      scoreLabel.value++;
      scoreLabel.text = scoreLabel.value;
    });
  
    action('dangerous', (d) => {
      d.move(-ENEMY_SPEED, 0);
    });
  
    player.collides('dangerous', (d) => {
      if (isJumping) {
        destroy(d);
      } else {
        go('lose', { score: scoreLabel.value });
      }
    });
  
    player.action(() => {
      camPos(player.pos);
      if (player.pos.y >= FALL_DEATH) {
        go('lose', { score: scoreLabel.value });
      }
    });
  
    player.collides('pipe', () => {
      keyPress('down', () => {
        go('game', {
          level: (level + 1) % maps.length,
          score: scoreLabel.value,
        });
      });
    });
  
    keyDown('left', () => {
      player.move(-MOVE_SPEED, 0);
    });
  
    keyDown('right', () => {
      player.move(MOVE_SPEED, 0);
    });
  
    player.action(() => {
      if (player.grounded()) {
        isJumping = false;
      }
    });
  
    keyPress('space', () => {
      if (player.grounded()) {
        isJumping = true;
        player.jump(CURRENT_JUMP_FORCE);
      }
    });
  });

  // game.js

async function saveUser(username, score) {
  try {
    const response = await fetch('http://localhost:8083/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, score }),
    });
    // Handle response if necessary
    return response.json(); // Return the parsed JSON response
  } catch (error) {
    console.error('Error saving user:', error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

module.exports = { saveUser };


  
  scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)]);
  
    // Add restart button
    const restartBtn = add([
      text('Restart'),
      pos(width() / 2, height() / 2 + 50),
      origin('center'),
      layer('ui'),
      scale(2),
      {
        value: score,
      },
    ]);
  
    // Handle restart button click
    restartBtn.action(() => {
      if (restartBtn.isHovered()) {
        restartBtn.color = rgb(0.5, 0.5, 1);
        if (mouseIsClicked()) {
          go('game', { level: 0, score: 0 });
        }
      } else {
        restartBtn.color = rgb(1, 1, 1);
      }
    });
  
    // Update highest score if current score is higher
    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem('highestScore', highestScore);
      // Save user and score to backend
      console.log('test highscore');
      try {
        const savedUser =  saveUser(username, score);
        console.log('User saved:', savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
    }

    }
    else{
        console.log('test highscore');
      try {
        const savedUser =  saveUser(username, score);
        console.log('User saved:', savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
    }
    }
  
    // Display username and score
    add([
      text('Username: ' + username + ' (Highest: ' + highestScore + ')' + '\nScore: ' + score, 12),
      pos(width() / 2, height() / 2 - 50),
      origin('center'),
      layer('ui'),
    ]);
  });


  
  console.log("test usrname ",username);
  console.log("test score")
  start('game', { level: 0, score: 0 });
