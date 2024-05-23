window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            player.y-=10;
            break
        case 'a':
            //keys.a.pressed = true;
            player.x-=10;
            break
        case 's':
            //keys.s.pressed = true;
            player.y+=10;
            break
        case 'd':
            //keys.d.pressed = true;
            player.x+=10;
            break
}})