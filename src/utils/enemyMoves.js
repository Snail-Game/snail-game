export function enemyMoves(newArray, strength, enemyStrength, addMessage, durability, health, spikes) {
  let playerX = 0;
  let playerY = 0;
  newArray.forEach((column, i) => {
    column.forEach((tile, j) => {
      if (tile.id === 9) {
        playerX = i;
        playerY = j;
      }
    })
  })

  newArray.forEach((column, i) => {
    column.forEach((tile, j) => {
      if (tile.id === 8) {
        const random = Math.floor(Math.random() * 4 + 1);
        const randomChase = Math.floor(Math.random() * 10 + 1);
        let newArray2 = [];
        newArray.forEach((column, i) => {
          newArray2[i] = [];
          column.forEach((tile, j) => {
            newArray2[i][j] = {...tile};
          })
        })
        const moveRight = () => {
          if (newArray[i + 1][j].id === 0) {
            newArray2[i + 1][j] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i + 1][j].id === 9) {
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i + 1][j].hp -= enemyAttack;
            newArray2[i][j].hp -= spikes.current;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + spikes.current + ' damage!');
            if (newArray2[i + 1][j].hp <= 0) {
              newArray2[i + 1][j].id = 0;
              newArray2[i + 1][j].hp = 0;
              addMessage('GAME OVER');
            }
            if (newArray2[i][j].hp <= 0) {
              newArray2[i][j].id = 0;
              newArray2[i][j].hp = 0;
              addMessage('Attacking enemy destroyed!')
            }
          }
        }
        const moveUp = () => {
          if (newArray[i][j - 1].id === 0) {
            newArray2[i][j - 1] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i][j - 1].id === 9) {
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i][j - 1].hp -= enemyAttack;
            newArray2[i][j].hp -= spikes.current;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + spikes.current + ' damage!');
            if (newArray2[i][j - 1].hp <= 0) {
              newArray2[i][j - 1].id = 0;
              newArray2[i][j - 1].hp = 0;
            }
            if (newArray2[i][j].hp <= 0) {
              newArray2[i][j].id = 0;
              newArray2[i][j].hp = 0;
              addMessage('Attacking enemy destroyed!')
            }
          }
        }
        const moveDown = () => {
          if (newArray[i][j + 1].id === 0) {
            newArray2[i][j + 1] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i][j + 1].id === 9) {
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i][j + 1].hp -= enemyAttack;
            newArray2[i][j].hp -= spikes.current;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + spikes.current + ' damage!');
            if (newArray2[i][j + 1].hp <= 0) {
              newArray2[i][j + 1].id = 0;
              newArray2[i][j + 1].hp = 0;
              addMessage('GAME OVER');
            }
            if (newArray2[i][j].hp <= 0) {
              newArray2[i][j].id = 0;
              newArray2[i][j].hp = 0;
              addMessage('Attacking enemy destroyed!')
            }
          }
        }
        const moveLeft = () => {
          if (newArray[i - 1][j].id === 0) {
            newArray2[i - 1][j] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i - 1][j].id === 9) {
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i - 1][j].hp -= enemyAttack;
            newArray2[i][j].hp -= spikes.current;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + spikes.current + ' damage!');
            if (newArray2[i - 1][j].hp <= 0) {
              newArray2[i - 1][j].id = 0;
              newArray2[i - 1][j].hp = 0;
              addMessage('GAME OVER');
            }
            if (newArray2[i][j].hp <= 0) {
              newArray2[i][j].id = 0;
              newArray2[i][j].hp = 0;
              addMessage('Attacking enemy destroyed!')
            }
          }
        }

        // pursue player
        if (Math.abs(playerX - i) <= 2 && Math.abs(playerY - j <= 2)) {
          if (playerX - i > 0 && randomChase > 6) {
            moveRight();
          } else if (playerX - i < 0 && randomChase > 6) {
            moveLeft();
          } else if (playerY - j > 0 && randomChase < 5) {
            moveDown();
          } else if (playerY - j < 0 && randomChase < 5) {
            moveUp();
          } else if (playerX - i === 0 && playerY - j > 0 && randomChase < 5) {
            moveDown();
          } else if (playerX - i === 0 && playerY - j < 0 && randomChase < 5) {
            moveUp();
          } else if (playerY - j === 0 && playerX - i > 0 && randomChase > 6) {
            moveRight();
          } else if (playerY - j === 0 && playerX - i < 0 && randomChase > 6) {
            moveLeft();
          }
        } else if (random === 1) {       // move at random
          moveUp();
        } else if (random === 2) {
          moveRight();
        } else if (random === 3) {
          moveDown();
        } else if (random === 4) {
          moveLeft();
        }
        newArray2.forEach((column) => {
          column.forEach((tile) => {
            if (tile.id === 9) {
              health.current = tile.hp;
            }
          });
        });
        newArray2.forEach((column, i) => {
          column.forEach((tile, j) => {
            newArray[i][j] = {...tile};
          })
        })
      }
    })
  })
  return newArray;
}