const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Particle {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.angle = Math.random() * 2 * Math.PI;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.previousVelocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 마우스 반경 x 내에 있을 때
        if (Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)) < x) {
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            this.velocity.x = Math.cos(angle) * 10;
            this.velocity.y = Math.sin(angle) * 10;
        }
        // 원 밖에 있을 때
        else if (Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)) < x + this.radius) {
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            const newX = mouse.x + (x + this.radius) * Math.cos(angle);
            const newY = mouse.y + (x + this.radius) * Math.sin(angle);

            this.x = newX;
            this.y = newY;
            this.velocity = {
                x: Math.cos(angle) * this.speed,
                y: Math.sin(angle) * this.speed
            };
        }

        // 캔버스 범위 밖으로 나갈 때 처리
        if (this.x - this.radius > canvas.width) {
            this.x = -this.radius;
        } else if (this.x + this.radius < 0) {
            this.x = canvas.width + this.radius;
        }

        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius;
        } else if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
        }

        this.draw();
    }
}

const particles = [];
const x = 200;

function init() {
    particles.length = 0;

    for (let i = 0; i < 500; i++) {
        const radius = (Math.random() * 20 + 5) * 0.3;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const speed = (Math.random() * 2 + 1) * 0.3;

        particles.push(new Particle(x, y, radius, color, speed));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}

init();
animate();