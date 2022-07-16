export function enemyMoves(newArray, strength, enemyStrength, addMessage) {
  newArray.forEach((column, i) => {
    column.forEach((tile, j) => {
      if (tile.id === 8) {
        let newArray2 = [];
        newArray.forEach((column, i) => {
          newArray2[i] = [];
          column.forEach((tile, j) => {
            newArray2[i][j] = {...tile};
          })
        })
        const random = Math.floor(Math.random() * 4 + 1);
        if (random === 1) {
          if (newArray[i][j - 1].id === 0) {
            newArray2[i][j - 1] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i][j - 1].id === 9) {
            const attack = Math.ceil(Math.random() * strength);
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i][j - 1].hp -= enemyAttack;
            newArray2[i][j].hp -= attack;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + attack + ' damage!');
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
        } else if (random === 2) {
          if (newArray[i + 1][j].id === 0) {
            newArray2[i + 1][j] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i + 1][j].id === 9) {
            const attack = Math.ceil(Math.random() * strength);
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i + 1][j].hp -= enemyAttack;
            newArray2[i][j].hp -= attack;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + attack + ' damage!');
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
        } else if (random === 3) {
          if (newArray[i][j + 1].id === 0) {
            newArray2[i][j + 1] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;

          } else if (newArray[i][j + 1].id === 9) {
            const attack = Math.ceil(Math.random() * strength);
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i][j + 1].hp -= enemyAttack;
            newArray2[i][j].hp -= attack;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + attack + ' damage!');
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
        } else if (random === 4) {
          if (newArray[i - 1][j].id === 0) {
            newArray2[i - 1][j] = {...newArray[i][j]};
            newArray2[i][j].id = 0;
            newArray2[i][j].hp = 0;
          } else if (newArray[i - 1][j].id === 9) {
            const attack = Math.ceil(Math.random() * strength);
            const enemyAttack = Math.ceil(Math.random() * enemyStrength);
            newArray2[i - 1][j].hp -= enemyAttack;
            newArray2[i][j].hp -= attack;
            // draw damage animation here
            addMessage('Enemy attacks you for ' + enemyAttack + ' damage!');
            addMessage('Enemy takes ' + attack + ' damage!');
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