let posX = 0, posZ = 200, rotX = 0, rotY = 0;
const keys = {};
const speed = 4;
const oniPos = { x: 0, z: -1500 };

// 迷路データ（1=壁, 0=通路）
const mazeData = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1],
    [1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
];

// 迷路の生成
const mazeContainer = document.getElementById('maze');
mazeData.forEach((row, z) => {
    row.forEach((cell, x) => {
        if (cell === 1) {
            const wall = document.createElement('div');
            wall.className = 'wall';
            // 各セルの中心に壁を配置
            let wx = (x - 3) * 400;
            let wz = (z - 3) * 400;
            wall.style.transform = `translate3d(${wx}px, -200px, ${wz}px)`;
            mazeContainer.appendChild(wall);
        }
    });
});

// 入力イベント
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
document.body.addEventListener('click', () => document.body.requestPointerLock());

document.addEventListener('mousemove', e => {
    if (document.pointerLockElement) {
        rotY -= e.movementX * 0.15;
        rotX += e.movementY * 0.15;
        rotX = Math.max(-30, Math.min(30, rotX));
    }
});

function update() {
    // 移動計算（Wで前進、Sで後退に修正）
    const rad = rotY * Math.PI / 180;
    if (keys['w']) {
        posX -= Math.sin(rad) * speed;
        posZ -= Math.cos(rad) * speed;
    }
    if (keys['s']) {
        posX += Math.sin(rad) * speed;
        posZ += Math.cos(rad) * speed;
    }
    if (keys['a']) {
        posX -= Math.cos(rad) * speed;
        posZ += Math.sin(rad) * speed;
    }
    if (keys['d']) {
        posX += Math.cos(rad) * speed;
        posZ -= Math.sin(rad) * speed;
    }

    // 鬼の追跡（壁を無視して最短距離で迫る）
    const dx = posX - oniPos.x;
    const dz = posZ - oniPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    // 鬼の移動（少しずつスピードが上がる）
    const oniSpeed = 1.5; 
    if (dist > 40) {
        oniPos.x += (dx / dist) * oniSpeed;
        oniPos.z += (dz / dist) * oniSpeed;
    } else {
        document.getElementById('status').innerText = "捕まった...";
        return; // 捕まったら停止
    }

    // 表示更新
    const world = document.getElementById('world');
    // カメラ（プレイヤーの目線）の適用
    world.style.transform = `rotateX(${-rotX}deg) rotateY(${-rotY}deg) translate3d(${-posX}px, 0, ${-posZ}px)`;
    
    // 鬼を常にプレイヤーの方へ向かせる（ビルボード処理）
    const oni = document.getElementById('oni');
    oni.style.transform = `translate3d(${oniPos.x}px, -80px, ${oniPos.z}px) rotateY(${-rotY}deg)`;

    requestAnimationFrame(update);
}

update();
