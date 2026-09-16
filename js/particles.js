// Particle Effects System
class Particle {
    constructor(position, velocity, color) {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.color = color;
        this.life = 60;
        this.maxLife = 60;
        this.gravity = -0.02;
        
        this.mesh = this.createMesh();
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: this.color,
            emissive: this.color,
            emissiveIntensity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        mesh.castShadow = true;
        return mesh;
    }

    update() {
        this.life--;
        
        // Physics
        this.velocity.y += this.gravity;
        this.position.add(this.velocity);
        
        // Fade out
        const alpha = this.life / this.maxLife;
        this.mesh.material.opacity = alpha;
        this.mesh.material.emissiveIntensity = alpha * 0.8;

        this.mesh.position.copy(this.position);
    }

    isDead() {
        return this.life <= 0;
    }
}
