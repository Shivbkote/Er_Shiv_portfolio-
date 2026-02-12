$(document).ready(function () {
    // 1. Mobile Navbar Toggle (Runs on all pages)
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // 2. Initialize Particles (Runs if canvas exists)
    if (document.getElementById('particleCanvas')) {
        initParticles();
    }

   

    // 3. Project Fetching & Rendering
    // This check ensures it ONLY runs on your Projects page
    const projectContainer = document.querySelector(".box-container");
    
    if (projectContainer) {
        fetch("projects.json")
            .then(res => res.json())
            .then(data => {
                renderProjects(data, projectContainer);
            })
            .catch(err => console.error("Error loading projects:", err));
    }
});

function renderProjects(projects, container) {
    let html = "";
    projects.forEach(p => {
        html += `
        <div class="grid-item ${p.category}">
            <div class="box tilt">
                <img src="${p.image}.svg" alt="Project">
                <div class="content">
                    <div class="tag"><h3>${p.name}</h3></div>
                    <div class="desc">
                        <p>${p.desc}</p>
                        <div class="btns">
                            <a href="${p.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                            <a href="${p.links.code}" class="btn" target="_blank"><i class="fas fa-code"></i> Code</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    // Inject HTML
    container.innerHTML = html;

    // --- Initialize Plugins AFTER content is added to DOM ---

    // Initialize Isotope
    var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // Filter Button Logic
    $('.button-group').on('click', 'button', function () {
        $('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        let filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    // Initialize Tilt
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 8, 
        speed: 400, 
        glare: true, 
        "max-glare": 0.2
    });
}

// Particle Background Animation
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.alpha = Math.random();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 242, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
