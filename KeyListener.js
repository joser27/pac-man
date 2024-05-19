window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            loop();
            break
        case 'a':
            //keys.a.pressed = true;
            player.x-=4;
            break
        case 's':
            //keys.s.pressed = true;
            player.y+=4;
            break
        case 'd':
            //keys.d.pressed = true;
            player.x+=4;
            break
}})