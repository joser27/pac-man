window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            player.y-=1;
            break
        case 'a':
            //keys.a.pressed = true;
            player.x-=1;
            break
        case 's':
            //keys.s.pressed = true;
            player.y+=1;
            break
        case 'd':
            //keys.d.pressed = true;
            player.x+=1;
            break
}})