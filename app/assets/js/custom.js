function moveElements() {
    // animate elements on mouse move
    const img = document.querySelector('.mouse-move');
    const body = document.body;

    function moveImg(e) {
        const { offsetWidth: width, offsetHeight: height } = body;
        let { clientX: x, clientY: y } = e;
        const move = 20;

        const xMove = Math.round((x / width * move) - (move / 2));
        const yMove = Math.round((y / height * move) - (move / 2));

        img.style.marginLeft = `${xMove}px`;
        img.style.marginTop = `${yMove}px`;

        if (!img.hasAttribute('src')) {
            img.style.boxShadow = `${xMove}px ${yMove}px 100px 0 rgba(0, 0, 0, .6)`;
        }
    } 

    if (img) {
        body.addEventListener('mousemove', moveImg);
    }
}

function toggleMenu() {
    const nav = document.getElementById('menu');
    const navLinks = document.querySelectorAll('#menu a img');
    const navContent = document.getElementById('menu-content');

    function toggleMenu(e) {
        e.preventDefault();
        if (e.target !== this) return;
        navContent.classList.toggle('active');
        nav.classList.toggle('active');
    }

    for (let i=0; i<navLinks.length; i++) {
        navLinks[i].addEventListener('click', toggleMenu);
    }

    if (nav && navContent) {    
        navContent.addEventListener('click', toggleMenu);  
    }   
}

function trimString(string) {
    return string.toLowerCase().replace(/\s/g, '-').replace(/[.!_&%/:;')(+?,=]/g, '');
}

export {moveElements, toggleMenu, trimString};