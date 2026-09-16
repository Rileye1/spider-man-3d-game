// Enemy AI System
class Enemy {
    constructor(scene, x, y, z, waveLevel) {
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, 0);
        
        this.waveLevel = waveLevel;
        this.health = 30 + (waveLevel * 10);
        this.maxHealth = this.health;
        this.speed = 0.15 + (waveLevel * 0.05);
        this.damage = 10 + (waveLevel * 2);
        this.attackRange = 2;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.gravity = -0.03;
        this.isJumping = false;
        
        this.state = 'idle'; // idle, chase, attack
        this.stateTimer = 0;
        this.mesh = this.createMesh();
    }

    createMesh() {
        const group = new THREE.Group();
        
        // Enemy variant based on wave
        const colors = [0x00aa00, 0x0066ff, 0xffaa00, 0xff00ff];
        const color = colors[this.waveLevel % colors.length];

        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.35, 1.0, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.22, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.3;
        head.castShadow = true;
        group.add(head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 1.4, 0.18);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 1.4, 0.18);
        group.add(rightEye);

        // Weapon indicator (extra limb)
        const weaponGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8);
        const weaponMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0.5, 0.8, 0);
        weapon.castShadow = true;
        group.add(weapon);

        group.position.copy(this.position);
        this.scene.add(group);
        
        return group;
    }

    update(player) {
        const distanceToPlayer = this.position.distanceTo(player.position);

        // AI State Machine
        if (distanceToPlayer < this.attackRange + 1) {
            this.state = 'attack';
        } else if (distanceToPlayer < 30) {
            this.state = 'chase';
        } else {
            this.state = 'idle';
        }

        // Movement
        if (this.state === 'chase') {
            const direction = player.position.clone().sub(this.position).normalize();
            this.position.add(direction.multiplyScalar(this.speed));
        } else if (this.state === 'idle') {
            this.stateTimer++;
            if (this.stateTimer > 60) {
                this.position.x += (Math.random() - 0.5) * 0.5;
                this.position.z += (Math.random() - 0.5) * 0.5;
                this.stateTimer = 0;
            }
        }

        // Attack
        if (this.state === 'attack' && this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = 40 - (this.waveLevel * 2);
        }

        // Gravity
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;

        // Ground collision
        if (this.position.y <= 1) {
            this.position.y = 1;
            this.velocity.y = 0;
        }

        // Occasionally jump
        if (Math.random() < 0.01 && this.position.y <= 1.05) {
            this.velocity.y = 0.5;
        }

        // Face player
        const direction = player.position.clone().sub(this.position);
        const angle = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.y = angle;

        this.mesh.position.copy(this.position);

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        } else {
            this.isAttacking = false;
        }

        // Animation
        if (this.state === 'chase') {
            this.mesh.rotation.x = Math.sin(Date.now() * 0.01) * 0.15;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Knockback
        const knockbackForce = amount * 0.1;
        this.velocity.y = Math.max(this.velocity.y, knockbackForce);

        // Flash effect
        const originalColor = this.mesh.children[0].material.color.getHex();
        this.mesh.children[0].material.color.setHex(0xffffff);
        setTimeout(() => {
            this.mesh.children[0].material.color.setHex(originalColor);
        }, 80);

        // Health bar update
        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('enemyHealthFill').style.width = healthPercent + '%';
    }
}
