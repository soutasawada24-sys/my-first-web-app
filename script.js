
let posX = 0, posZ = 0, rotX = 0, rotY = 0;
const keys = {};
const speed = 5;
const oniPos = { x: 0, z: -1000 };

// 入力検知
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
document.body.addEventListener('click', () => document.body.requestPointerLock());

// マウス移動で視点を変える
document.addEventListener('mousemove', e => {
    if (document.pointerLockElement) {
        rotY -= e.movementX * 0.2;
        rotX += e.movementY * 0.2;
        rotX = Math.max(-45, Math.min(45, rotX)); // 上下の回転制限
    }
});

function update() {
    // プレイヤーの移動計算
    const rad = rotY * Math.PI / 180;
    if (keys['w']) { posX -= Math.sin(rad) * speed; posZ += Math.cos(rad) * speed; }
    if (keys['s']) { posX += Math.sin(rad) * speed; posZ -= Math.cos(rad) * speed; }
    if (keys['a']) { posX -= Math.cos(rad) * speed; posZ -= Math.sin(rad) * speed; }
    if (keys['d']) { posX += Math.cos(rad) * speed; posZ += Math.sin(rad) * speed; }

    // 鬼の追跡AI (プレイヤーの方へじわじわ近づく)
    const dx = posX - oniPos.x;
    const dz = posZ - oniPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 50) {
        oniPos.x += (dx / dist) * 2;
        oniPos.z += (dz / dist) * 2;
    } else {
        document.getElementById('status').innerText = "GAME OVER";
        document.getElementById('status').style.color = "red";
    }

    // 表示の更新
    const world = document.getElementById('world');
    world.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${-posX}px, 0, ${-posZ}px)`;
    
    const oni = document.getElementById('oni');
    oni.style.transform = `translate3d(${oniPos.x}px, -50px, ${oniPos.z}px) rotateY(${-rotY}deg)`;

    requestAnimationFrame(update);
}

update();
