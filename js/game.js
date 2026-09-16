// Game Core Engine
class GameEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 2, 0);

        this.player = null;
        this.enemies = [];
        this.particles = [];
        this.currentWave = 1;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.gameOver = false;
        this.groundLevel = 0;

        this.setupLights();
        this.setupGround();
        this.setupPlayer();
        this.setupUI();
        this.spawnWave();

        window.addEventListener('resize', () => this.onWindowResize());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());

        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xff0000, 0.5, 50);
        pointLight.position.set(15, 10, 0);
        this.scene.add(pointLight);
    }

    setupGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2d2d44 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x333333);
        this.scene.add(gridHelper);
    }

    setupPlayer() {
        this.player = new Player(this.scene, 0, 2, 0);
        this.player.position = new THREE.Vector3(0, 1, 0);
    }

    setupUI() {
        this.updateHealthBar();
        this.updateScore();
    }

    spawnWave() {
        const enemyCount = 2 + Math.floor(this.currentWave / 2);
        for (let i = 0; i < enemyCount; i++) {
            const angle = (i / enemyCount) * Math.PI * 2;
            const distance = 20;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            const enemy = new Enemy(this.scene, x, 1, z, this.currentWave);
            this.enemies.push(enemy);
        }
    }

    updateHealthBar() {
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('playerHealthFill').style.width = healthPercent + '%';
    }

    updateEnemyHealthBar() {
        if (this.enemies.length > 0) {
            const activeEnemy = this.enemies[0];
            const healthPercent = (activeEnemy.health / activeEnemy.maxHealth) * 100;
            document.getElementById('enemyHealthFill').style.width = healthPercent + '%';
        }
    }

    updateScore() {
        document.getElementById('scoreText').textContent = `Score: ${this.score}`;
        document.getElementById('comboText').textContent = `Combo: ${this.combo}`;
    }

    updateWaveDisplay() {
        document.getElementById('waveText').textContent = `Wave: ${this.currentWave}`;
    }

    checkCollisions() {
        // Player to Enemy collisions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const distance = this.player.position.distanceTo(enemy.position);

            // Combat detection
            if (distance < 3) {
                if (this.player.isAttacking) {
                    enemy.takeDamage(this.player.currentDamage);
                    this.player.isAttacking = false;
                    
                    // Knockback
                    const knockbackDir = enemy.position.clone().sub(this.player.position).normalize();
                    enemy.velocity.add(knockbackDir.multiplyScalar(10));

                    // Combo system
                    this.combo++;
                    this.score += 10 * this.combo;
                    this.comboTimer = 60;
                }

                if (enemy.isAttacking && distance < 2) {
                    this.player.takeDamage(enemy.damage);
                }
            }

            // Remove dead enemies
            if (enemy.health <= 0) {
                this.scene.remove(enemy.mesh);
                this.enemies.splice(i, 1);
                this.score += 100 * this.currentWave;
                this.combo = Math.max(0, this.combo - 5);
            }
        }

        // Wave progression
        if (this.enemies.length === 0 && !this.gameOver) {
            this.currentWave++;
            this.updateWaveDisplay();
            this.spawnWave();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.gameOver) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        // Update player
        this.player.update();

        // Update enemies
        for (let enemy of this.enemies) {
            enemy.update(this.player);
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.scene.remove(this.particles[i].mesh);
                this.particles.splice(i, 1);
            }
        }

        // Update combo timer
        if (this.comboTimer > 0) {
            this.comboTimer--;
        } else {
            this.combo = 0;
        }

        this.checkCollisions();
        this.updateHealthBar();
        this.updateEnemyHealthBar();
        this.updateScore();

        // Camera follow player
        const targetCameraPos = new THREE.Vector3(
            this.player.position.x + 5,
            this.player.position.y + 8,
            this.player.position.z + 15
        );
        this.camera.position.lerp(targetCameraPos, 0.1);
        this.camera.lookAt(this.player.position.x, this.player.position.y + 2, this.player.position.z);

        // Check game over
        if (this.player.health <= 0) {
            this.endGame();
        }

        this.renderer.render(this.scene, this.camera);
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('gameOverScreen').style.display = 'flex';
        document.getElementById('gameOverTitle').textContent = `WAVE ${this.currentWave} - DEFEATED`;
        document.getElementById('gameOverScore').textContent = `Final Score: ${this.score}`;
    }

    restart() {
        // Remove all enemies
        for (let enemy of this.enemies) {
            this.scene.remove(enemy.mesh);
        }
        this.enemies = [];

        // Remove all particles
        for (let particle of this.particles) {
            this.scene.remove(particle.mesh);
        }
        this.particles = [];

        // Reset player
        this.player.health = this.player.maxHealth;
        this.player.position.set(0, 1, 0);
        this.player.velocity.set(0, 0, 0);

        // Reset game state
        this.currentWave = 1;
        this.score = 0;
        this.combo = 0;
        this.gameOver = false;

        document.getElementById('gameOverScreen').style.display = 'none';
        this.updateWaveDisplay();
        this.spawnWave();
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    addParticle(position, velocity, color) {
        const particle = new Particle(position, velocity, color);
        this.particles.push(particle);
        this.scene.add(particle.mesh);
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new GameEngine();
});