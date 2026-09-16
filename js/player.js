// Player Controller
class Player {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, 0);
        
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 0.3;
        this.jumpForce = 0.7;
        this.gravity = -0.03;
        this.isJumping = false;
        this.isAttacking = false;
        this.currentDamage = 0;
        this.attackCooldown = 0;
        
        this.keys = {};
        this.mesh = this.createMesh();
        
        this.setupControls();
    }

    createMesh() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        group.add(head);

        // Eyes (web pattern)
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 1.65, 0.2);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 1.65, 0.2);
        group.add(rightEye);

        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.6, 1.2, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.6, 1.2, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 4, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.25, 0.3, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.25, 0.3, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        group.position.copy(this.position);
        this.scene.add(group);
        
        return group;
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Jump
            if (e.key === ' ' && !this.isJumping) {
                this.velocity.y = this.jumpForce;
                this.isJumping = true;
            }
            
            // Attacks
            if (e.key === 'q' && this.attackCooldown <= 0) {
                this.webAttack();
            }
            if (e.key === 'e' && this.attackCooldown <= 0) {
                this.punchAttack();
            }
            if (e.key === 'r' && this.attackCooldown <= 0) {
                this.spinAttack();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    webAttack() {
        this.isAttacking = true;
        this.currentDamage = 15;
        this.attackCooldown = 30;
        
        // Web projectile effect
        const webGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const webMaterial = new THREE.MeshStandardMaterial({ color: 0xccccff });
        const web = new THREE.Mesh(webGeometry, webMaterial);
        web.position.copy(this.position);
        web.castShadow = true;
        
        // Animate web
        let webLife = 60;
        const webUpdate = () => {
            web.position.y += 0.3;
            web.position.z -= 0.5;
            webLife--;
            if (webLife <= 0) {
                this.scene.remove(web);
            } else {
                requestAnimationFrame(webUpdate);
            }
        };
        webUpdate();
        this.scene.add(web);
    }

    punchAttack() {
        this.isAttacking = true;
        this.currentDamage = 20;
        this.attackCooldown = 40;
    }

    spinAttack() {
        this.isAttacking = true;
        this.currentDamage = 25;
        this.attackCooldown = 60;
        
        // Spin effect
        let spinAngle = 0;
        const spinUpdate = () => {
            spinAngle += 0.3;
            this.mesh.rotation.y = spinAngle;
            if (spinAngle < Math.PI * 2) {
                requestAnimationFrame(spinUpdate);
            } else {
                this.mesh.rotation.y = 0;
            }
        };
        spinUpdate();
    }

    update() {
        // Movement
        const moveDirection = new THREE.Vector3(0, 0, 0);
        
        if (this.keys['w']) moveDirection.z -= this.speed;
        if (this.keys['s']) moveDirection.z += this.speed;
        if (this.keys['a']) moveDirection.x -= this.speed;
        if (this.keys['d']) moveDirection.x += this.speed;

        this.position.add(moveDirection);

        // Gravity and jumping
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;

        // Ground collision
        if (this.position.y <= 1) {
            this.position.y = 1;
            this.velocity.y = 0;
            this.isJumping = false;
        }

        // Boundaries
        const boundarySize = 40;
        this.position.x = Math.max(-boundarySize, Math.min(boundarySize, this.position.x));
        this.position.z = Math.max(-boundarySize, Math.min(boundarySize, this.position.z));

        this.mesh.position.copy(this.position);

        // Animation
        if (moveDirection.length() > 0) {
            this.mesh.rotation.x = Math.sin(Date.now() * 0.01) * 0.2;
        }

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        } else {
            this.isAttacking = false;
            this.currentDamage = 0;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Flash effect
        const originalColor = this.mesh.children[0].material.color.getHex();
        this.mesh.children[0].material.color.setHex(0xffffff);
        setTimeout(() => {
            this.mesh.children[0].material.color.setHex(originalColor);
        }, 100);
    }
}
